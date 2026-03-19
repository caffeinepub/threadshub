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
  ChevronLeft,
  ChevronRight,
  Expand,
  Laptop,
  Maximize,
  Minimize,
  Package,
  Pause,
  Play,
  RefreshCw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Star,
  Truck,
  X,
  ZoomIn,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
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

// ─── Image Lightbox Component ───────────────────────────────────────────────
function ImageLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbs, setShowThumbs] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isMobileView, setIsMobileView] = useState(false);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Pinch-to-zoom
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartZoom = useRef(1);

  const prev = useCallback(() => {
    setZoom(1);
    setCurrent((c) => (c - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setZoom(1);
    setCurrent((c) => (c + 1) % images.length);
  }, [images.length]);

  // Slideshow
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % images.length);
        setZoom(1);
      }, 3500);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, images.length]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, onClose]);

  // Fullscreen API
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Pinch-to-zoom handlers
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist.current = Math.sqrt(dx * dx + dy * dy);
      pinchStartZoom.current = zoom;
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDist.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const newZoom = Math.min(
        4,
        Math.max(1, pinchStartZoom.current * (dist / pinchStartDist.current)),
      );
      setZoom(newZoom);
    }
  };
  const onTouchEnd = () => {
    pinchStartDist.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] bg-black/95 flex flex-col"
      style={{ touchAction: "none" }}
    >
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-black/70 backdrop-blur-sm z-10 flex-shrink-0">
        <span className="text-white/70 text-sm font-medium">
          {current + 1} / {images.length}
        </span>
        <div className="flex items-center gap-1">
          {/* Device / Thumbnails toggle */}
          <button
            type="button"
            onClick={() => setIsMobileView((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title={isMobileView ? "Desktop view" : "Mobile view"}
          >
            {isMobileView ? (
              <Laptop className="w-5 h-5" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </button>

          {/* Thumbnails toggle */}
          <button
            type="button"
            onClick={() => setShowThumbs((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title={showThumbs ? "Hide thumbnails" : "Show thumbnails"}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="14" y="3" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="3" y="14" width="7" height="7" strokeWidth={2} rx="1" />
              <rect x="14" y="14" width="7" height="7" strokeWidth={2} rx="1" />
            </svg>
          </button>

          {/* Slideshow play/pause */}
          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title={isPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          {/* Zoom in */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(4, z + 0.5))}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          {/* Zoom out */}
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.5))}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title="Zoom out"
            disabled={zoom <= 1}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth={2} />
              <line x1="8" y1="11" x2="14" y2="11" strokeWidth={2} />
            </svg>
          </button>

          {/* Fullscreen */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-5 h-5" />
            ) : (
              <Maximize className="w-5 h-5" />
            )}
          </button>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-lg hover:bg-white/10 transition ml-1"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        {/* Image */}
        <div
          className="flex items-center justify-center overflow-hidden"
          style={{
            width: isMobileView ? "375px" : "100%",
            maxWidth: isMobileView ? "375px" : "800px",
            height: isMobileView ? "667px" : "100%",
            maxHeight: isMobileView ? "667px" : "100%",
            border: isMobileView ? "2px solid rgba(255,255,255,0.15)" : "none",
            borderRadius: isMobileView ? "16px" : "0",
            background: isMobileView ? "#111" : "transparent",
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <img
            src={images[current]}
            alt={`Product view ${current + 1}`}
            style={{
              transform: `scale(${zoom})`,
              transition: "transform 0.2s ease",
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              cursor: zoom > 1 ? "zoom-out" : "zoom-in",
            }}
            onClick={() => setZoom((z) => (z > 1 ? 1 : Math.min(2, z + 0.5)))}
            onKeyDown={() => setZoom((z) => (z > 1 ? 1 : Math.min(2, z + 0.5)))}
            draggable={false}
          />
        </div>

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={next}
            className="absolute right-3 z-10 bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbs && images.length > 1 && (
        <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-black/60 backdrop-blur-sm flex-shrink-0 justify-center">
          {images.map((img, i) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: lightbox thumbnail order is stable
              key={i}
              onClick={() => {
                setCurrent(i);
                setZoom(1);
              }}
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                current === i
                  ? "border-white scale-105"
                  : "border-white/20 hover:border-white/50"
              }`}
            >
              <img
                src={img}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sticky Add-to-Cart Bar ──────────────────────────────────────────────────
function StickyCartBar({
  product,
  displayPrice,
  hasDiscount,
  onAddToCart,
  onBuyNow,
  visible,
}: {
  product: ReturnType<typeof getProducts>[number];
  displayPrice: number;
  hasDiscount: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  visible: boolean;
}) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: visible ? 0 : 100, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-2xl px-4 py-3 flex items-center gap-3"
    >
      {/* Product thumb */}
      <img
        src={product.image}
        alt={product.name}
        className="w-12 h-12 object-cover rounded-sm flex-shrink-0 hidden sm:block"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{product.name}</p>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-foreground">
            Rs. {displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <Button
          onClick={onAddToCart}
          variant="outline"
          size="sm"
          className="rounded-sm font-semibold border-foreground hover:bg-foreground hover:text-background text-xs px-3"
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-1" />
          Cart
        </Button>
        <Button
          onClick={onBuyNow}
          size="sm"
          className="rounded-sm bg-primary hover:opacity-90 font-semibold text-xs px-3"
        >
          Buy Now
        </Button>
      </div>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [stickyVisible, setStickyVisible] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);
  const enterTimeRef = useRef<number>(Date.now());

  // Viewing count — popular products start higher
  const baseCount = product?.isBestSeller
    ? 20 + ((id?.charCodeAt(0) ?? 0) % 8)
    : 8 + ((id?.charCodeAt(0) ?? 0) % 5);
  const [viewingCount, setViewingCount] = useState(baseCount);

  // Real visitor time tracking — count goes up faster the longer someone stays
  useEffect(() => {
    enterTimeRef.current = Date.now();
    const schedule = () => {
      // delay shorter the longer user has been on page (active viewer = more views)
      const timeOnPage = (Date.now() - enterTimeRef.current) / 1000;
      const delay =
        timeOnPage > 60
          ? 8000 + Math.random() * 7000
          : timeOnPage > 30
            ? 12000 + Math.random() * 8000
            : 18000 + Math.random() * 12000;
      return setTimeout(() => {
        setViewingCount((prev) => {
          const min = product?.isBestSeller ? 18 : 6;
          const max = product?.isBestSeller ? 35 : 14;
          const delta = Math.random() > 0.4 ? 1 : -1;
          return Math.min(max, Math.max(min, prev + delta));
        });
        timerRef.current = schedule();
      }, delay);
    };
    const timerRef = { current: schedule() };
    return () => clearTimeout(timerRef.current);
  }, [product?.isBestSeller]);

  // Sticky bar on scroll past CTA
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    if (ctaRef.current) obs.observe(ctaRef.current);
    return () => obs.disconnect();
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
    <>
      {/* Lightbox */}
      {lightboxOpen && (
        <ImageLightbox
          images={allImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Sticky bar */}
      <StickyCartBar
        product={product}
        displayPrice={displayPrice}
        hasDiscount={!!hasDiscount}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        visible={stickyVisible}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* ── Images ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {/* Main image — click to open lightbox */}
            <button
              type="button"
              className="relative overflow-hidden rounded-sm bg-secondary cursor-zoom-in group w-full text-left"
              onClick={() => {
                setLightboxIndex(activeImage);
                setLightboxOpen(true);
              }}
              aria-label="Click to view full image"
            >
              <img
                src={allImages[activeImage]}
                alt={product.name}
                className="w-full h-[460px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Expand hint */}
              <div className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Expand className="w-4 h-4" />
              </div>
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
              {/* Left/Right arrows on main image */}
              {allImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage(
                        (i) => (i - 1 + allImages.length) % allImages.length,
                      );
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImage((i) => (i + 1) % allImages.length);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </button>
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

          {/* ── Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Category badges */}
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

            {/* Product name */}
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* ★ Color selection — RIGHT BELOW NAME ★ */}
            {product.colors && product.colors.length > 0 && (
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
            )}

            {/* Rating */}
            <div className="flex items-center gap-2">
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

            {/* Description */}
            <p className="font-sans text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Key highlights */}
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
                            <th className="py-2 text-left font-semibold">
                              Hips
                            </th>
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

            {/* ★ Viewing count — right after qty, highly attractive ★ */}
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-md bg-red-50 border border-red-200 w-fit">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <span className="text-sm font-bold text-red-700">
                {viewingCount} people viewing this right now
              </span>
              <span className="text-xs text-red-500">
                {viewingCount > 20
                  ? "🔥 Very popular"
                  : viewingCount > 12
                    ? "⚡ Trending"
                    : "👀 Active"}
              </span>
            </div>

            {/* CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3">
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

        {/* Bundle Upsell */}
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
            <h2 className="font-display text-2xl font-bold">
              Customer Reviews
            </h2>
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
    </>
  );
}
