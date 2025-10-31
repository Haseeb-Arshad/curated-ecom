import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: number | string;
  qty: number;
  product: { id: string; name: string; image?: string | null; price_cents?: number | null; currency?: string | null };
};

function apiBase() {
  // eslint-disable-next-line no-undef
  return (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
}

function ensureCartId(): string {
  if (typeof window === "undefined") return "";
  const key = "anon_cart_id";
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
    window.localStorage.setItem(key, id);
  }
  return id;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | number | null>(null);

  useEffect(() => {
    const base = apiBase();
    if (!base) {
      setLoading(false);
      setItems([]);
      return;
    }
    const id = ensureCartId();
    fetch(`${base}/api/cart`, { headers: { "x-cart-id": id } })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load cart");
        return r.json();
      })
      .then((data) => setItems(Array.isArray(data.items) ? data.items : []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const subtotal = useMemo(() =>
    items.reduce((sum, it) => sum + (it.product.price_cents ?? 0) * it.qty, 0), [items]
  );
  const currency = items[0]?.product.currency ?? "USD";

  const updateQty = async (id: string | number, qty: number) => {
    const base = apiBase(); if (!base) return;
    const cartId = ensureCartId();
    setBusyId(id);
    try {
      const res = await fetch(`${base}/api/cart/items/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-cart-id": cartId },
        body: JSON.stringify({ qty }),
      });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.map((it) => it.id === id ? { ...it, qty } : it).filter((it) => it.qty > 0));
    } finally {
      setBusyId(null);
    }
  };

  const removeItem = async (id: string | number) => updateQty(id, 0);

  if (loading) return <div className="container">Loading cart…</div>;
  if (error) return <div className="container">{error}</div>;

  return (
    <div className="container stack-md">
      <h1>Your Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul role="list" className="stack-sm">
            {items.map((it) => (
              <li key={it.id} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <img src={it.product.image || "/images/placeholder.svg"} alt="" width={72} height={72} style={{ objectFit: "cover", borderRadius: 8 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{it.product.name}</div>
                  <div style={{ opacity: 0.7 }}>{it.product.price_cents ? `${(it.product.price_cents/100).toFixed(2)} ${it.product.currency}` : ""}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button disabled={busyId===it.id || it.qty<=1} onClick={() => updateQty(it.id, Math.max(1, it.qty-1))}>-</button>
                  <span>{it.qty}</span>
                  <button disabled={busyId===it.id} onClick={() => updateQty(it.id, it.qty+1)}>+</button>
                  <button disabled={busyId===it.id} onClick={() => removeItem(it.id)}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <strong>Subtotal</strong>
            <strong>{(subtotal/100).toFixed(2)} {currency}</strong>
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="/checkout" className="button">Proceed to Checkout</a>
          </div>
        </>
      )}
    </div>
  );
}
