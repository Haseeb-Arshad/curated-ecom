import { useEffect, useMemo, useState } from "react";

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

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const base = apiBase();
    if (!base) { setLoading(false); return; }
    const id = ensureCartId();
    fetch(`${base}/api/cart`, { headers: { "x-cart-id": id } })
      .then(r => r.json())
      .then(data => setItems(data.items || []))
      .finally(() => setLoading(false));
  }, []);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (it.product.price_cents ?? 0) * it.qty, 0), [items]);
  const currency = items[0]?.product.currency ?? "USD";

  const placeOrder = async () => {
    setMsg(null); setError(null);
    const base = apiBase(); if (!base) return;
    const res = await fetch(`${base}/api/orders/checkout`, { method: "POST" });
    if (res.status === 401) { setError("Please sign in to checkout."); return; }
    if (!res.ok) { setError("Checkout failed."); return; }
    const data = await res.json();
    setMsg(`Order ${data.id} created. Status: ${data.status}`);
  };

  if (loading) return <div className="container">Loading…</div>;
  if (!items.length) return <div className="container">Your cart is empty.</div>;

  return (
    <div className="container stack-md">
      <h1>Checkout</h1>
      <ul role="list" className="stack-sm">
        {items.map((it) => (
          <li key={it.id} style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <img src={it.product.image || "/images/placeholder.svg"} alt="" width={56} height={56} style={{ objectFit: "cover", borderRadius: 8 }} />
            <div style={{ flex: 1 }}>{it.product.name} × {it.qty}</div>
            <div>{(((it.product.price_cents ?? 0) * it.qty)/100).toFixed(2)} {currency}</div>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <strong>Subtotal</strong>
        <strong>{(subtotal/100).toFixed(2)} {currency}</strong>
      </div>
      <div>
        <button onClick={placeOrder}>Place order</button>
      </div>
      {msg && <p>{msg}</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
