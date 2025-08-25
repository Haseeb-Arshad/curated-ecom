import { Link, NavLink } from "react-router";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-1 text-sm ${isActive ? "underline" : "hover:underline"} decoration-1 underline-offset-4`;

  return (
    <div className="flex min-h-screen flex-col bg-[--bg]">
      <header
        className={`${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
        } sticky top-0 z-10 w-full border-b border-gray-200/80 bg-white/70 backdrop-blur transition-all dark:border-gray-800/80 dark:bg-gray-950/70`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center" aria-label="Home">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-current"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1" />
            </svg>
          </Link>
          <nav className="flex gap-6">
            <NavLink to="/" end className={navLinkClass}>
              Discover
            </NavLink>
            <NavLink to="/browse" className={navLinkClass}>
              Browse
            </NavLink>
            <NavLink to="/blog" className={navLinkClass}>
              Blog
            </NavLink>
            <NavLink to="/info" className={navLinkClass}>
              Info
            </NavLink>
          </nav>
          <button
            aria-label="Search"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300/50 bg-white/70 text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800/70 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 5 5" />
            </svg>
          </button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 bg-[--bg] text-[--subtle]">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <form className="mb-8 flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded border border-gray-300 bg-white/5 px-3 py-2 text-sm dark:border-gray-700"
            />
            <button
              type="submit"
              className="rounded bg-gray-900 px-4 py-2 text-sm text-white dark:bg-gray-100 dark:text-gray-900"
            >
              Subscribe
            </button>
          </form>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="mb-2 font-medium">Navigation</h3>
              <ul className="space-y-1">
                <li>
                  <NavLink to="/" className="hover:underline">
                    Discover
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/browse" className="hover:underline">
                    Browse
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/blog" className="hover:underline">
                    Blog
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/info" className="hover:underline">
                    Info
                  </NavLink>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-2 font-medium">About</h3>
              <p className="text-sm">
                Curated e-commerce project placeholder.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-medium">Contact</h3>
              <p className="text-sm">hello@example.com</p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
            <p>© {new Date().getFullYear()} Curated</p>
            <p className="flex items-center gap-1">
              Made by <span className="inline-block h-2 w-2 rounded-full bg-current" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
