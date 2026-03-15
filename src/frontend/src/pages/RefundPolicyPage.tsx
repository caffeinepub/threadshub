import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <main
      className="max-w-2xl mx-auto px-4 py-12"
      data-ocid="refund-policy.page"
    >
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        data-ocid="refund-policy.link"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="text-3xl font-bold mb-2">Refund Policy</h1>
      <p className="text-muted-foreground mb-8">
        We want you to be completely satisfied with your purchase. If you're not
        happy, here's how we handle returns and refunds.
      </p>

      <div className="space-y-6">
        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold">Return Window</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You have{" "}
            <strong className="text-foreground">
              7 days from the date of delivery
            </strong>{" "}
            to request a return. After this period, we are unable to process
            return requests. Please ensure you initiate your return request as
            soon as possible if you are unhappy with your order.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <h2 className="text-lg font-bold">Eligible Items</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            To be eligible for a return, items must meet the following
            conditions:
          </p>
          <ul className="space-y-2 text-sm">
            {[
              "Item must be unused and in original condition",
              "Original tags must still be attached",
              "Must be in original packaging",
              "Item must not show signs of wear, wash, or damage",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-lg font-bold">Return Process</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            To initiate a return, contact us on WhatsApp at{" "}
            <a
              href="https://wa.me/923174933882"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold underline underline-offset-2"
            >
              0317-4933882
            </a>{" "}
            with your order number and clear photos of the item. Our team will
            review your request and guide you through the next steps. Returns
            must be shipped back to us within 3 days of approval.
          </p>
        </div>

        <div className="border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-orange-600" />
            </div>
            <h2 className="text-lg font-bold">Refund Timeline</h2>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Once your return is received and inspected, we will notify you of
            the approval status. Approved refunds are processed within{" "}
            <strong className="text-foreground">3–5 business days</strong>. For
            COD orders, the refund will be sent via EasyPaisa or JazzCash to the
            number you provide.
          </p>
        </div>

        <div className="border border-red-100 bg-red-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-red-700">
              Non-Returnable Items
            </h2>
          </div>
          <ul className="space-y-2 text-sm">
            {[
              "Sale or discounted items",
              "Items that have been worn or washed",
              "Items damaged due to customer misuse",
              "Items returned after the 7-day window",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          data-ocid="refund-policy.primary_button"
        >
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}
