import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Package } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  country: string;
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: "",
    country: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitted, setSubmitted] = useState(false);
  const [orderNum] = useState(
    () => `TH-${Math.floor(100000 + Math.random() * 900000)}`,
  );

  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  const validate = (): boolean => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Valid email is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.city.trim()) e.city = "City is required";
    if (!form.zip.trim()) e.zip = "ZIP code is required";
    if (!form.country.trim()) e.country = "Country is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    clearCart();
  };

  const handleChange =
    (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  if (cartItems.length === 0 && !submitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to checkout</h1>
        <p className="text-muted-foreground mt-2 font-sans">
          Your cart is empty.
        </p>
        <Link to="/shop">
          <Button className="mt-8 bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-8">
            Shop Now
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
            data-ocid="checkout.success_state"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-4xl font-bold">
              Order Confirmed!
            </h1>
            <p className="text-muted-foreground mt-3 font-sans">
              Thank you, <strong>{form.name}</strong>! Your order has been
              placed.
            </p>
            <div className="mt-6 bg-secondary/50 rounded-sm px-8 py-6 inline-block">
              <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                Order Number
              </p>
              <p className="font-display text-2xl font-bold text-primary">
                {orderNum}
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground font-sans">
              A confirmation will be sent to <strong>{form.email}</strong>
            </p>
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <Link to="/shop">
                <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-8 uppercase tracking-widest text-sm">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display text-4xl font-bold mb-8">Checkout</h1>

            <div className="grid lg:grid-cols-3 gap-10">
              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="lg:col-span-2 space-y-6"
                noValidate
              >
                <div>
                  <h2 className="font-display text-xl font-semibold mb-4">
                    Shipping Information
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="name" className="font-sans text-sm">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={handleChange("name")}
                        placeholder="Jane Doe"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.name_input"
                      />
                      {errors.name && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="email" className="font-sans text-sm">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="jane@example.com"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.email_input"
                      />
                      {errors.email && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="address" className="font-sans text-sm">
                        Street Address
                      </Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={handleChange("address")}
                        placeholder="123 Main Street"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.address_input"
                      />
                      {errors.address && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="city" className="font-sans text-sm">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={handleChange("city")}
                        placeholder="New York"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.city_input"
                      />
                      {errors.city && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="zip" className="font-sans text-sm">
                        ZIP / Postal Code
                      </Label>
                      <Input
                        id="zip"
                        value={form.zip}
                        onChange={handleChange("zip")}
                        placeholder="10001"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.zip_input"
                      />
                      {errors.zip && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.zip}
                        </p>
                      )}
                    </div>
                    <div className="sm:col-span-2">
                      <Label htmlFor="country" className="font-sans text-sm">
                        Country
                      </Label>
                      <Input
                        id="country"
                        value={form.country}
                        onChange={handleChange("country")}
                        placeholder="United States"
                        className="mt-1 rounded-sm"
                        data-ocid="checkout.country_input"
                      />
                      {errors.country && (
                        <p
                          className="text-destructive text-xs mt-1"
                          data-ocid="checkout.error_state"
                        >
                          {errors.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  data-ocid="checkout.submit_button"
                  className="w-full bg-primary text-primary-foreground hover:opacity-90 rounded-sm py-4 font-semibold uppercase tracking-widest text-sm gap-2"
                >
                  <Package className="h-4 w-4" />
                  Place Order · ${total.toFixed(2)}
                </Button>
              </form>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-sm shadow-card p-6 sticky top-24">
                  <h2 className="font-display text-lg font-semibold mb-4">
                    Order Summary
                  </h2>
                  <Separator className="mb-4" />
                  {cartItems.map((item) => (
                    <div
                      key={item.cartKey}
                      className="flex justify-between text-sm font-sans mb-2"
                    >
                      <span className="text-muted-foreground truncate max-w-[150px]">
                        {item.product.name} ×{item.qty}
                      </span>
                      <span className="font-medium">
                        ${(item.product.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between text-sm font-sans mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans text-muted-foreground mb-2">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-sans font-bold text-base border-t border-border pt-3 mt-2">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
