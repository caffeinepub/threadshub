import { useCart } from "@/context/CartContext";
import { getSettings } from "@/utils/settingsStorage";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/", exact: true },
  { label: "Men", to: "/shop", search: { category: "Men" } },
  { label: "Women", to: "/shop", search: { category: "Women" } },
  { label: "Boys", to: "/shop", search: { category: "Boys" } },
  { label: "Girls", to: "/shop", search: { category: "Girls" } },
  { label: "Baby", to: "/shop", search: { category: "Baby" } },
  { label: "New Arrivals", to: "/shop", search: { filter: "new" } },
  { label: "Best Sellers", to: "/shop", search: { filter: "bestseller" } },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [storeName, setStoreName] = useState(() => getSettings().storeName);

  useEffect(() => {
    const handler = () => setStoreName(getSettings().storeName);
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Close mobile menu on route change
  // biome-ignore lint/correctness/useExhaustiveDependencies: setMobileOpen is stable
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const midpoint = Math.ceil(storeName.length / 2);
  const nameFirst = storeName.slice(0, midpoint);
  const nameLast = storeName.slice(midpoint);

  const handleNavClick = (link: (typeof NAV_LINKS)[0]) => {
    setMobileOpen(false);
    if (link.search) {
      navigate({
        to: link.to,
        search: link.search as unknown as Record<string, string>,
      });
    } else {
      navigate({ to: link.to });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1 flex-shrink-0">
          <span className="font-display text-2xl font-bold tracking-tight text-foreground">
            {nameFirst}
          </span>
          <span className="font-display text-2xl font-bold tracking-tight text-primary">
            {nameLast}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === "/" && link.exact
                ? location.pathname === "/"
                : location.pathname === link.to &&
                  (!link.search ||
                    Object.entries(link.search).every(
                      ([k, v]) =>
                        new URLSearchParams(location.search).get(k) === v,
                    ));
            return (
              <button
                type="button"
                key={link.label}
                onClick={() => handleNavClick(link)}
                data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                className={`text-sm font-sans font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-foreground border-b-2 border-primary pb-0.5"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            data-ocid="nav.cart_button"
            className="relative p-2 hover:text-primary transition-colors"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            className="lg:hidden p-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            data-ocid="nav.menu.button"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  data-ocid={`nav.mobile.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
                  className="text-base font-sans font-medium uppercase tracking-widest text-foreground/70 hover:text-foreground transition-colors py-2.5 text-left border-b border-border/40 last:border-0"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
