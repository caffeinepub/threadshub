import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type ShippingMethod = "cod" | "card";
type BillingOption = "same" | "different";

interface FormData {
  email: string;
  phone: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryPhone: string;
  notifyDeals: boolean;
}

interface BillingForm {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("cod");
  const [paymentMethod, setPaymentMethod] = useState<ShippingMethod>("cod");
  const [billingOption, setBillingOption] = useState<BillingOption>("same");
  const [submitted, setSubmitted] = useState(false);
  const [showPaymentPage, setShowPaymentPage] = useState(false);
  const [form, setForm] = useState<FormData>({
    email: "",
    phone: "",
    name: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryPhone: "",
    notifyDeals: false,
  });
  const [billingForm, setBillingForm] = useState<BillingForm>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {},
  );
  const [orderNum] = useState(
    () => `TH-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  const productTotal = cartTotal;
  const shippingFee = shippingMethod === "cod" ? 250 : 1;
  const grandTotal = productTotal + shippingFee;

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const handleBillingChange =
    (field: keyof BillingForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setBillingForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.email.includes("@")) e.email = "Valid email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.deliveryPhone.trim())
      e.deliveryPhone = "Phone number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (paymentMethod === "card") {
      setShowPaymentPage(true);
    } else {
      clearCart();
      setSubmitted(true);
    }
  };

  const handleConfirmPayment = () => {
    clearCart();
    setSubmitted(true);
    setShowPaymentPage(false);
  };

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";

  if (cartItems.length === 0 && !submitted) {
    return (
      <main className="max-w-lg mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <p className="text-muted-foreground mt-2">Your cart is empty.</p>
        <Link to="/shop">
          <Button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8">
            Shop Now
          </Button>
        </Link>
      </main>
    );
  }

  if (submitted) {
    return (
      <main
        className="max-w-lg mx-auto px-4 py-16 text-center"
        data-ocid="checkout.success_state"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold mb-2">
          Thank you, {form.name.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground">Your order has been confirmed</p>
        <div className="mt-6 bg-gray-50 rounded-lg p-5 text-left border">
          <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold mb-1">
            Order Number
          </p>
          <p className="text-xl font-bold text-blue-600">{orderNum}</p>
        </div>
        <div className="mt-4 bg-gray-50 rounded-lg p-5 text-left border space-y-1">
          <p className="font-semibold text-sm">Order details</p>
          <p className="text-sm text-muted-foreground">Contact: {form.email}</p>
          <p className="text-sm text-muted-foreground">
            Address: {form.name}, {form.address}, {form.city}, Pakistan,{" "}
            {form.deliveryPhone}
          </p>
          <p className="text-sm text-muted-foreground">
            Shipping:{" "}
            {shippingMethod === "cod"
              ? "FLAT SHIPPING 249 PKR + FBR POS FEE 1 PKR"
              : "FREE SHIPPING + FBR POS FEE 1 PKR"}
          </p>
          <p className="text-sm text-muted-foreground">
            Payment:{" "}
            {paymentMethod === "cod"
              ? "Cash on Delivery (COD)"
              : "EasyPaisa / JazzCash"}
          </p>
          <p className="text-sm text-muted-foreground">
            Billing address:{" "}
            {billingOption === "same"
              ? "Same as shipping"
              : "Different billing address"}
          </p>
        </div>
        <div className="mt-6">
          <Link to="/shop">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full">
              Continue shopping
            </Button>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Need help?{" "}
            <Link to="/" className="text-blue-600 underline">
              Contact us
            </Link>
          </p>
        </div>
      </main>
    );
  }

  // Payment page for EasyPaisa / JazzCash
  if (showPaymentPage) {
    return (
      <motion.main
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen bg-gray-50"
        data-ocid="checkout.modal"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowPaymentPage(false)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              data-ocid="checkout.cancel_button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold">Complete Payment</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
          {/* Amount Banner */}
          <div className="bg-blue-600 text-white rounded-xl p-5 text-center shadow-md">
            <p className="text-sm opacity-80 mb-1">Total Amount to Pay</p>
            <p className="text-4xl font-extrabold tracking-tight">
              Rs {grandTotal.toFixed(0)}
            </p>
            <p className="text-sm opacity-80 mt-1">Pakistani Rupees (PKR)</p>
          </div>

          {/* EasyPaisa */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Clean white header with official logo */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <img
                src="/assets/generated/easypaisa-logo-transparent.dim_200x80.png"
                alt="EasyPaisa"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Mobile Account
              </span>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                Send money to
              </p>
              <p className="text-2xl font-extrabold text-gray-900 tracking-widest mb-1">
                0304-1329809
              </p>
              <p className="text-sm text-green-700 font-medium mb-4">
                Send Rs {grandTotal.toFixed(0)} to this number via EasyPaisa
              </p>
              <div className="space-y-2">
                {[
                  "Open your EasyPaisa app",
                  'Go to "Send Money"',
                  "Enter number: 03041329809",
                  `Enter amount: Rs ${grandTotal.toFixed(0)}`,
                  "Screenshot your transaction",
                ].map((step, stepIdx) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {stepIdx + 1}
                    </span>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* JazzCash */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Clean white header with official logo */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white">
              <img
                src="/assets/generated/jazzcash-logo-transparent.dim_200x80.png"
                alt="JazzCash"
                className="h-10 w-auto object-contain"
              />
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                Mobile Account
              </span>
            </div>
            <div className="px-5 py-4">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                Send money to
              </p>
              <p className="text-2xl font-extrabold text-gray-900 tracking-widest mb-1">
                0304-1329809
              </p>
              <p className="text-sm text-red-700 font-medium mb-4">
                Send Rs {grandTotal.toFixed(0)} to this number via JazzCash
              </p>
              <div className="space-y-2">
                {[
                  "Open your JazzCash app",
                  'Go to "Send Money"',
                  "Enter number: 03041329809",
                  `Enter amount: Rs ${grandTotal.toFixed(0)}`,
                  "Screenshot your transaction",
                ].map((step, stepIdx) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {stepIdx + 1}
                    </span>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <p className="text-xs text-yellow-800 font-medium">
              ⏱ After payment, your order will be confirmed within 1-2 hours.
              Please keep your transaction screenshot safe.
            </p>
          </div>

          {/* Confirm Button */}
          <button
            type="button"
            onClick={handleConfirmPayment}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2 shadow-md"
            data-ocid="checkout.confirm_button"
          >
            <CheckCircle className="h-5 w-5" />I have paid — Confirm Order
          </button>

          <div className="text-center pb-6">
            <button
              type="button"
              onClick={() => setShowPaymentPage(false)}
              className="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
            >
              Cancel — go back
            </button>
          </div>
        </div>
      </motion.main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <form onSubmit={handleSubmit} noValidate>
        {/* Sticky Order Summary Toggle Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-lg mx-auto px-4">
            <button
              type="button"
              onClick={() => setOrderSummaryOpen((v) => !v)}
              className="flex items-center justify-between w-full py-4 text-blue-600 font-medium text-sm"
              data-ocid="checkout.toggle"
            >
              <span className="flex items-center gap-1">
                Order summary
                {orderSummaryOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </span>
              <span className="text-gray-900 font-semibold text-base">
                Rs {grandTotal.toFixed(2)}
              </span>
            </button>

            <AnimatePresence>
              {orderSummaryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 border-t border-gray-100 pt-3 space-y-3">
                    {cartItems.map((item) => (
                      <div
                        key={item.cartKey}
                        className="flex items-center gap-3"
                      >
                        <div className="relative">
                          <div className="w-14 h-14 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                          <span className="absolute -top-1.5 -right-1.5 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {item.product.name}
                          </p>
                          {item.size && (
                            <p className="text-xs text-muted-foreground">
                              {item.size}
                            </p>
                          )}
                        </div>
                        <span className="text-sm font-semibold">
                          Rs {(item.product.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="border-t pt-3 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>Rs {productTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Shipping</span>
                        <span className="flex items-center gap-1">
                          {shippingMethod === "card" && (
                            <span className="line-through text-muted-foreground text-xs">
                              Rs 250.00
                            </span>
                          )}
                          Rs {shippingFee.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-sm pt-1 border-t">
                        <span>
                          Total{" "}
                          <span className="text-xs font-normal text-muted-foreground">
                            PKR
                          </span>
                        </span>
                        <span>Rs {grandTotal.toFixed(2)}</span>
                      </div>
                      {shippingMethod === "card" && (
                        <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                          <span>TOTAL SAVINGS Rs 249.00</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          {/* Contact Section */}
          <section data-ocid="checkout.section">
            <h2 className="text-lg font-bold mb-3">Contact</h2>
            <div className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange("email")}
                  className={inputClass}
                  data-ocid="checkout.email_input"
                />
                {errors.email && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={handleChange("phone")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
                {errors.phone && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.phone}
                  </p>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.notifyDeals}
                  onChange={handleChange("notifyDeals")}
                  className="w-4 h-4 rounded border-gray-300 accent-blue-600"
                  data-ocid="checkout.checkbox"
                />
                <span className="text-sm text-gray-700">
                  Notify me about deals and offers
                </span>
              </label>
            </div>
          </section>

          {/* Delivery Section */}
          <section data-ocid="checkout.section">
            <h2 className="text-lg font-bold mb-3">Delivery</h2>
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
                {errors.name && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Address"
                  value={form.address}
                  onChange={handleChange("address")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
                {errors.address && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.address}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City"
                  value={form.city}
                  onChange={handleChange("city")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
                {errors.city && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Postal code (optional)"
                  value={form.postalCode}
                  onChange={handleChange("postalCode")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={form.deliveryPhone}
                  onChange={handleChange("deliveryPhone")}
                  className={inputClass}
                  data-ocid="checkout.input"
                />
                {errors.deliveryPhone && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="checkout.error_state"
                  >
                    {errors.deliveryPhone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Method Section */}
          <section data-ocid="checkout.section">
            <h2 className="text-lg font-bold mb-3">Shipping method</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
              <label
                htmlFor="ship-cod"
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  shippingMethod === "cod"
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="ship-cod"
                  name="shipping"
                  checked={shippingMethod === "cod"}
                  onChange={() => {
                    setShippingMethod("cod");
                    setPaymentMethod("cod");
                  }}
                  className="accent-blue-600"
                  data-ocid="checkout.radio"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    FLAT SHIPPING 249 PKR + FBR POS FEE 1 PKR
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cash on Delivery (COD)
                  </p>
                </div>
                <span className="text-sm font-bold">Rs 250.00</span>
              </label>
              <label
                htmlFor="ship-card"
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  shippingMethod === "card"
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="ship-card"
                  name="shipping"
                  checked={shippingMethod === "card"}
                  onChange={() => {
                    setShippingMethod("card");
                    setPaymentMethod("card");
                  }}
                  className="accent-blue-600"
                  data-ocid="checkout.radio"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    FREE SHIPPING + FBR POS FEE 1 PKR
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Debit - Credit Card
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs line-through text-muted-foreground">
                    Rs 250.00
                  </p>
                  <p className="text-sm font-bold">Rs 1.00</p>
                </div>
              </label>
            </div>
          </section>

          {/* Payment Section */}
          <section data-ocid="checkout.section">
            <h2 className="text-lg font-bold">Payment</h2>
            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5 mb-3">
              <Lock className="h-3 w-3" /> All transactions are secure and
              encrypted.
            </p>
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
              <label
                htmlFor="pay-cod"
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="pay-cod"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => {
                    setPaymentMethod("cod");
                    setShippingMethod("cod");
                  }}
                  className="accent-blue-600"
                  data-ocid="checkout.radio"
                />
                <span className="text-sm font-medium">
                  Cash on Delivery (COD)
                </span>
              </label>
              <div>
                <label
                  htmlFor="pay-card"
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                    paymentMethod === "card"
                      ? "bg-blue-50 border-l-2 border-l-blue-500"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    id="pay-card"
                    name="payment"
                    checked={paymentMethod === "card"}
                    onChange={() => {
                      setPaymentMethod("card");
                      setShippingMethod("card");
                    }}
                    className="accent-blue-600"
                    data-ocid="checkout.radio"
                  />
                  <span className="text-sm font-medium flex-1">
                    EasyPaisa / JazzCash
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src="/assets/generated/easypaisa-logo-transparent.dim_200x80.png"
                      alt="EasyPaisa"
                      className="h-6 w-auto object-contain"
                    />
                    <img
                      src="/assets/generated/jazzcash-logo-transparent.dim_200x80.png"
                      alt="JazzCash"
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                </label>
                {paymentMethod === "card" && (
                  <div className="bg-gray-50 px-4 py-3 text-center text-sm text-muted-foreground border-t border-gray-200">
                    You'll be redirected to EasyPaisa / JazzCash to complete
                    your purchase.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Billing Address Section */}
          <section data-ocid="checkout.section">
            <h2 className="text-lg font-bold mb-3">
              Billing address{" "}
              <span className="text-sm font-normal text-muted-foreground">
                (optional)
              </span>
            </h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-200">
              <label
                htmlFor="bill-same"
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  billingOption === "same"
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="bill-same"
                  name="billing"
                  checked={billingOption === "same"}
                  onChange={() => setBillingOption("same")}
                  className="accent-blue-600"
                  data-ocid="checkout.radio"
                />
                <span className="text-sm font-medium">
                  Same as shipping address
                </span>
              </label>
              <label
                htmlFor="bill-different"
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  billingOption === "different"
                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  id="bill-different"
                  name="billing"
                  checked={billingOption === "different"}
                  onChange={() => setBillingOption("different")}
                  className="accent-blue-600"
                  data-ocid="checkout.radio"
                />
                <span className="text-sm font-medium">
                  Use a different billing address
                </span>
              </label>
            </div>

            {/* Billing form fields — animated */}
            <AnimatePresence>
              {billingOption === "different" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Full name"
                        value={billingForm.name}
                        onChange={handleBillingChange("name")}
                        className={inputClass}
                        data-ocid="checkout.input"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address"
                        value={billingForm.address}
                        onChange={handleBillingChange("address")}
                        className={inputClass}
                        data-ocid="checkout.input"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="City"
                        value={billingForm.city}
                        onChange={handleBillingChange("city")}
                        className={inputClass}
                        data-ocid="checkout.input"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Postal code (optional)"
                        value={billingForm.postalCode}
                        onChange={handleBillingChange("postalCode")}
                        className={inputClass}
                        data-ocid="checkout.input"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="Phone"
                        value={billingForm.phone}
                        onChange={handleBillingChange("phone")}
                        className={inputClass}
                        data-ocid="checkout.input"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Final Order Summary */}
          <section
            className="border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50"
            data-ocid="checkout.section"
          >
            <h2 className="text-base font-bold mb-2">Order summary</h2>
            {cartItems.map((item) => (
              <div key={item.cartKey} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.product.name} ×{item.qty}
                </span>
                <span>Rs {(item.product.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>Rs {productTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="flex items-center gap-1">
                  {shippingMethod === "card" && (
                    <span className="line-through text-muted-foreground text-xs">
                      Rs 250.00
                    </span>
                  )}
                  Rs {shippingFee.toFixed(2)}
                </span>
              </div>
              {shippingMethod === "card" && (
                <div className="bg-green-50 border border-green-200 rounded-md px-3 py-2 text-sm text-green-700 font-medium">
                  Congratulations! You saved Rs 249 on shipping.
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>
                  Total{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    PKR
                  </span>
                </span>
                <span>Rs {grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </section>

          {/* Pay Now Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg text-base transition-colors flex items-center justify-center gap-2"
            data-ocid="checkout.submit_button"
          >
            <ShieldCheck className="h-5 w-5" />
            Pay now
          </button>

          <div className="text-center pb-6 space-x-3">
            <Link
              to="/refund-policy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              data-ocid="checkout.refund-policy.link"
            >
              Refund policy
            </Link>
            <span className="text-xs text-muted-foreground">·</span>
            <Link
              to="/service-policy"
              className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
              data-ocid="checkout.service-policy.link"
            >
              Terms of service
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}
