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
            <p className="mt-3 text-sm font-semibold text-foreground">
              📞 0317-4933882
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
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Size Guide: XS (30), S (32), M (34), L (36), XL (38), XXL (40). Check the label on each product for exact measurements.",
                      { duration: 6000 },
                    )
                  }
                  data-ocid="footer.size-guide.button"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Size Guide
                </button>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  data-ocid="footer.refund-policy.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(
                      "Shipping Info: Standard delivery takes 3-7 business days nationwide Pakistan. COD available everywhere.",
                      { duration: 6000 },
                    )
                  }
                  data-ocid="footer.shipping-info.button"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer text-left"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <Link
                  to="/service-policy"
                  data-ocid="footer.service-policy.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Service Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/refund-policy"
                  data-ocid="footer.refund-policy-2.link"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/923174933882"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-ocid="footer.contact.link"
                  className="text-muted-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-3.5 h-3.5 text-green-600"
                    role="img"
                    aria-label="WhatsApp"
                  >
                    <title>WhatsApp</title>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Contact Us
                </a>
              </li>
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
