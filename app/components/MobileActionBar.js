"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, FileText } from "lucide-react";
import { track } from "@vercel/analytics";

const RECRUITING_PHONE_TEL = "+16013005529";

// Persistent mobile-only action bar: the two conversion actions (call /
// get a callback) stay one thumb-tap away no matter how deep a driver
// scrolls. Hidden on /apply — that page IS the apply action, and the bar
// would cover the form's submit area. Hidden at md+ where the navbar's
// Apply button and inline CTAs are always visible.
export default function MobileActionBar() {
  const pathname = usePathname();
  // Hidden on the two form-first pages where the bar would cover the
  // submit area (/application is the hidden full DOT application).
  if (pathname === "/apply" || pathname === "/application") return null;

  return (
    <>
      {/* Spacer keeps the fixed bar from covering the footer's last rows. */}
      <div aria-hidden className="h-16 md:hidden" />
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-2 border-t border-white/15 bg-black text-white shadow-[0_-4px_12px_rgba(0,0,0,0.35)]"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={`tel:${RECRUITING_PHONE_TEL}`}
          onClick={() => track("call_tap", { placement: "mobile_bar" })}
          className="flex items-center justify-center gap-2 py-4 text-base font-bold"
        >
          <Phone aria-hidden className="w-5 h-5" /> Call Now
        </a>
        <Link
          href="/apply"
          onClick={() => track("apply_tap", { placement: "mobile_bar" })}
          className="flex items-center justify-center gap-2 py-4 text-base font-bold bg-white text-black"
        >
          <FileText aria-hidden className="w-5 h-5" /> Get a Callback
        </Link>
      </div>
    </>
  );
}
