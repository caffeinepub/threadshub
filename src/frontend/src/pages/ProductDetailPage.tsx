import ProductCard from "@/components/ProductCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { getProducts } from "@/utils/productStorage";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const colorMap: Record<string, string> = {
  White: "#FFFFFF",
  Blue: "#3B82F6",
  Grey: "#9CA3AF",
  Black: "#1F2937",
  Navy: "#1E3A5F",
  Brown: "#92400E",
  Pink: "#F9A8D4",
  Yellow: "#FDE68A",
  Beige: "#D2B48C",
  Green: "#22C55E",
  Red: "#EF4444",
  Purple: "#A855F7",
  "Pastel Pink": "#FBCFE8",
  "Pastel Blue": "#BFDBFE",
};

const sizeChart = [
  { size: "XS", chest: "32", waist: "26", hips: "34" },
  { size: "S", chest: "34", waist: "28", hips: "36" },
  { size: "M", chest: "36", waist: "30", hips: "38" },
  { size: "L", chest: "38", waist: "32", hips: "40" },
  { size: "XL", chest: "40", waist: "34", hips: "42" },
  { size: "XXL", chest: "42", waist: "36", hips: "44" },
];

const mockReviews = [
  {
    name: "Amna S.",
    city: "Karachi",
    rating: 5,
    date: "March 10, 2026",
    text: "Absolutely love the quality! True to size and the fabric is premium. Received in just 3 days.",
    avatar: "AS",
  },
  {
    name: "Bilal K.",
    city: "Lahore",
    rating: 5,
    date: "March 8, 2026",
    text: "Exactly as described. Perfect stitching, great color. Will definitely order again!",
    avatar: "BK",
  },
  {
    name: "Fatima R.",
    city: "Islamabad",
    rating: 4,
    date: "February 28, 2026",
    text: "Good quality product. Size chart is accurate. Delivery was on time. Happy with the purchase.",
    avatar: "FR",
  },
  {
    name: "Hasan M.",
    city: "Faisalabad",
    rating: 5,
    date: "February 20, 2026",
    text: "Best value for money in Pakistan. Highly recommend to everyone looking for quality clothing.",
    avatar: "HM",
  },
];

const WHATSAPP_NUMBER = "923174933882";

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const products = getProducts();
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [viewingCount, setViewingCount] = useState(
    3 + ((id?.charCodeAt(0) ?? 0) % 5),
  );

  useEffect(() => {
    const schedule = () => {
      const delay = 15000 + Math.random() * 15000;
      return setTimeout(() => {
        setViewingCount((prev) => {
          const delta = Math.random() > 0.5 ? 1 : -1;
          return Math.min(9, Math.max(3, prev + delta));
        });
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, []);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Link to="/shop" className="text-primary underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPct = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const stock = product.stock ?? 50;
  const isLowStock = stock <= 10 && stock > 0;
  const outOfStock = stock === 0;

  const images = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
  ].filter(Boolean) as string[];
  const colorImagesMap = product.colorImages ?? {};
  const extraColorImgs = Object.values(colorImagesMap).filter(
    (img): img is string => Boolean(img) && !images.includes(img),
  );
  const allImages =
    images.length > 0
      ? [...images, ...extraColorImgs]
      : [product.image, ...extraColorImgs];

  const handleColorSelect = (c: string) => {
    setSelectedColor(c);
    const img = colorImagesMap[c];
    if (img) {
      const idx = allImages.indexOf(img);
      if (idx !== -1) setActiveImage(idx);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color first");
      return;
    }
    addToCart(product, selectedSize, qty);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${selectedSize} · Color: ${selectedColor} · Qty: ${qty}`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color first");
      return;
    }
    addToCart(product, selectedSize, qty);
    navigate({ to: "/checkout" });
  };

  const handleWhatsAppOrder = () => {
    const msg = encodeURIComponent(`Hi, I want to order: ${product.name}`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          <div className="relative overflow-hidden rounded-sm bg-secondary">
            <img
              src={allImages[activeImage]}
              alt={product.name}
              className="w-full h-[460px] object-cover"
            />
            {product.isBestSeller && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-orange-500 text-white font-bold">
                  Best Seller
                </Badge>
              </div>
            )}
            {hasDiscount && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-500 text-white font-bold">
                  -{discountPct}% OFF
                </Badge>
              </div>
            )}
            {isLowStock && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-red-600/90 text-white text-xs font-semibold px-3 py-1.5 rounded text-center">
                  ⚠️ Limited Stock — Only {stock} pieces left!
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {allImages.map((img, i) => (
              <button
                type="button"
                // biome-ignore lint/suspicious/noArrayIndexKey: thumbnail images are stable positional
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
                  activeImage === i
                    ? "border-primary"
                    : "border-border hover:border-foreground/30"
                }`}
              >
                <img
                  src={img}
                  alt={`View ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Category badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {product.category}
            </Badge>
            {product.newArrival && (
              <Badge className="bg-green-600 text-white text-xs">
                New Arrival
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge className="bg-orange-500 text-white text-xs">
                Best Seller
              </Badge>
            )}
          </div>

          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${
                      s <= Math.round(product.rating ?? 4.5)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.rating ?? 4.5} ({product.reviewCount ?? 0} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="font-display text-4xl font-bold text-foreground">
              Rs. {displayPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="font-sans text-lg text-muted-foreground line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <Badge className="bg-red-100 text-red-700 mb-1">
                Save Rs. {(product.price - displayPrice).toLocaleString()}
              </Badge>
            )}
          </div>

          {/* Psychology elements */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span>{viewingCount} people viewing this right now</span>
            </div>
            {isLowStock && (
              <div className="flex items-center gap-1.5 text-xs text-red-600 font-semibold">
                <Zap className="h-3.5 w-3.5" />
                <span>Only {stock} left in stock!</span>
              </div>
            )}
          </div>

          <p className="font-sans text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Key highlights / short description */}
          {product.shortDescription && (
            <ul className="space-y-1.5">
              {product.shortDescription
                .split("\n")
                .filter(Boolean)
                .map((line) => (
                  <li
                    key={line}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
            </ul>
          )}

          {/* Fabric info */}
          {product.fabric && (
            <div className="bg-secondary/50 rounded-sm p-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm">
                <strong>Material:</strong> {product.fabric}
              </span>
            </div>
          )}

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            {outOfStock ? (
              <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-1 rounded">
                Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded">
                Only {stock} left
              </span>
            ) : (
              <span className="text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="h-3 w-3" /> In Stock
              </span>
            )}
          </div>

          {/* Size chart + select */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-semibold text-sm">
                Select Size
              </span>
              <Dialog>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    data-ocid="product.size_chart.button"
                    className="text-xs text-primary underline flex items-center gap-1"
                  >
                    <Ruler className="h-3 w-3" /> Size Chart
                  </button>
                </DialogTrigger>
                <DialogContent data-ocid="product.size_chart.dialog">
                  <DialogHeader>
                    <DialogTitle>Size Chart</DialogTitle>
                  </DialogHeader>
                  <p className="text-xs text-muted-foreground mb-3">
                    All measurements in inches
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 pr-4 text-left font-semibold">
                            Size
                          </th>
                          <th className="py-2 pr-4 text-left font-semibold">
                            Chest
                          </th>
                          <th className="py-2 pr-4 text-left font-semibold">
                            Waist
                          </th>
                          <th className="py-2 text-left font-semibold">Hips</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizeChart.map((row) => (
                          <tr
                            key={row.size}
                            className="border-b border-border/40"
                          >
                            <td className="py-2 pr-4 font-medium">
                              {row.size}
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground">
                              {row.chest}"
                            </td>
                            <td className="py-2 pr-4 text-muted-foreground">
                              {row.waist}"
                            </td>
                            <td className="py-2 text-muted-foreground">
                              {row.hips}"
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSelectedSize(s)}
                  className={`min-w-[3rem] px-3 py-2 rounded-sm border text-sm font-medium transition-all ${
                    selectedSize === s
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Color select */}
          <div className="space-y-2">
            <span className="font-sans font-semibold text-sm">
              Color{selectedColor ? `: ${selectedColor}` : ""}
            </span>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => handleColorSelect(c)}
                  title={c}
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    selectedColor === c
                      ? "border-foreground scale-110"
                      : "border-border hover:border-foreground/50"
                  }`}
                  style={{ backgroundColor: colorMap[c] ?? "#ccc" }}
                />
              ))}
            </div>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <span className="font-sans font-semibold text-sm">Qty:</span>
            <div className="flex items-center border border-border rounded-sm">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-secondary transition-colors text-lg leading-none"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold min-w-[3rem] text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(stock || 1, q + 1))}
                className="px-3 py-2 hover:bg-secondary transition-colors text-lg leading-none"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={outOfStock || added}
              data-ocid="product.add_to_cart_button"
              variant="outline"
              className="flex-1 rounded-sm font-semibold uppercase tracking-widest text-sm gap-2 border-foreground hover:bg-foreground hover:text-background"
            >
              <ShoppingBag className="h-4 w-4" />
              {added ? "Added!" : outOfStock ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              onClick={handleBuyNow}
              disabled={outOfStock}
              data-ocid="product.buy_now_button"
              className="flex-1 rounded-sm bg-primary hover:opacity-90 text-primary-foreground font-semibold uppercase tracking-widest text-sm gap-2"
            >
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </div>

          {/* WhatsApp Order Button */}
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            data-ocid="product.whatsapp_button"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-sm font-semibold text-sm text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#25D366" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Order via WhatsApp
          </button>

          {/* Trust Badges */}
          <div
            className="grid grid-cols-4 gap-2 pt-1"
            data-ocid="product.trust.section"
          >
            {[
              { icon: Truck, label: "Free Delivery" },
              { icon: Package, label: "COD" },
              { icon: RefreshCw, label: "Easy Returns" },
              { icon: ShieldCheck, label: "Secure" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center gap-1 p-2 bg-secondary/40 rounded-sm"
              >
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-[10px] font-semibold leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery info */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-sm">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Free delivery</span>
              <span className="text-xs text-muted-foreground">
                {product.deliveryThreshold ?? "Above Rs. 2,000"}
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-sm">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Easy returns</span>
              <span className="text-xs text-muted-foreground">
                {product.returnDays ?? 7}-day policy
              </span>
            </div>
            <div className="flex flex-col items-center text-center gap-1.5 p-3 bg-secondary/40 rounded-sm">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-semibold">Secure</span>
              <span className="text-xs text-muted-foreground">
                100% trusted
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bundle Upsell — Complete The Look */}
      {relatedProducts.length > 0 && (
        <section className="mt-20" data-ocid="product.bundle.section">
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 mb-8">
            <div>
              <h2 className="font-display text-2xl font-bold">
                Complete The Look
              </h2>
              <p className="text-muted-foreground font-sans text-sm mt-1">
                Buy 3 items and save{" "}
                <span className="font-semibold text-foreground">25%</span> on
                your order
              </p>
            </div>
            <Badge className="sm:ml-auto bg-orange-500 text-white self-start sm:self-auto">
              Bundle Deal
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Customer Reviews */}
      <section className="mt-20" data-ocid="product.reviews.section">
        <div className="mb-8">
          <h2 className="font-display text-2xl font-bold">Customer Reviews</h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-5 w-5 ${
                    s <= Math.round(product.rating ?? 4.5)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="font-semibold">
              {product.rating ?? 4.5} out of 5
            </span>
            <span className="text-muted-foreground text-sm">
              (
              {product.reviewCount ??
                (product.reviews && product.reviews.length > 0
                  ? product.reviews.length
                  : mockReviews.length)}{" "}
              reviews)
            </span>
          </div>
        </div>
        {(() => {
          const activeReviews =
            product.reviews && product.reviews.length > 0
              ? product.reviews
              : mockReviews;
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeReviews.map((r, i) => {
                const initials = r.name
                  .split(" ")
                  .map((w) => w[0] ?? "")
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                const isMock = "avatar" in r;
                return (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: stable review index
                    key={i}
                    className="bg-card p-5 rounded-sm shadow-card"
                    data-ocid={`product.review.item.${i + 1}`}
                  >
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3.5 w-3.5 ${
                            s <= r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {isMock
                          ? (r as (typeof mockReviews)[0]).avatar
                          : initials}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{r.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {isMock
                            ? `${(r as (typeof mockReviews)[0]).city} • `
                            : ""}
                          {r.date}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-20" data-ocid="product.related.section">
          <h2 className="font-display text-2xl font-bold mb-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
