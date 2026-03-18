import { X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="bg-foreground text-background text-sm font-sans font-medium py-2.5 px-4 flex items-center justify-center gap-2 relative"
      data-ocid="announcement.section"
    >
      <span className="text-center">
        🎉 <strong>FREE DELIVERY</strong> on orders above Rs. 2,000
        &nbsp;|&nbsp; Use code <strong className="text-primary">FIRST10</strong>{" "}
        for <strong>10% OFF</strong>
      </span>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss announcement"
        data-ocid="announcement.close_button"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
