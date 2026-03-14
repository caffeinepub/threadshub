import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export default function Footer() {
  const year = new Date().getFullYear();
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  const categories = [
    { label: "Men", value: "Men" },
    { label: "Women", value: "Women" },
    { label: "Boys", value: "Boys" },
    { label: "Girls", value: "Girls" },
    { label: "Baby", value: "Baby" },
  ];

  const helpLinks = [
    {
      label: "Size Guide",
      message:
        "Size Guide: XS (30), S (32), M (34), L (36), XL (38), XXL (40). Check the label on each product for exact measurements.",
    },
    {
      label: "Returns & Exchanges",
      message:
        "Returns & Exchanges: We accept returns within 30 days of delivery. Contact us with your order number to initiate a return.",
    },
    {
      label: "Shipping Info",
      message:
        "Shipping Info: Standard delivery takes 3-5 business days. Express delivery (1-2 days) is available at checkout.",
    },
    {
      label: "Contact Us",
      message:
        "Contact Us: Reach us at support@threadshub.com or WhatsApp +92-300-0000000. We reply within 24 hours.",
    },
  ];

  return (
    <footer className="border-t border-border bg-secondary/30 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-display text-xl font-bold">
              Threads<span className="text-primary">Hub</span>
            </span>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              Quality clothing for every age — from newborns to adults. Style
              that grows with your family.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.value}>
                  <Link
                    to="/shop"
                    search={{ category: cat.value }}
                    data-ocid={`footer.${cat.value.toLowerCase()}.link`}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest mb-3">
              Help
            </h4>
            <ul className="space-y-2 text-sm">
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => toast.info(link.message, { duration: 6000 })}
                    data-ocid={`footer.${link.label.toLowerCase().replace(/[^a-z0-9]/g, "-")}.button`}
                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {year}. Built with ❤️ using{" "}
          <a
            href={utmUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
