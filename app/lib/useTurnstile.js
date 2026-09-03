"use client";

import { useState, useEffect, useRef } from "react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_ID = "cf-turnstile-script";

// Shared Cloudflare Turnstile hook. Owns script loading (once per page,
// load-event-safe for client-side navigation races), widget render into the
// returned ref, expired/error token clearing, and unmount cleanup. Pass
// function references to render() — string window-callbacks break under
// React 18 StrictMode double-mounts.
//
// `active`: render only when the widget's container is actually mounted
// (e.g. the final step of a wizard). When TURNSTILE_SITE_KEY is unset
// (local dev), `enabled` is false and the form submits without a token —
// the backend then rejects or skips per its own config.
//
// NOTE: ContactClient and QuickApplyForm still carry their original inline
// copies of this logic; fold them into this hook in the consolidation pass.
export default function useTurnstile(active = true) {
  const widgetRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [token, setToken] = useState("");
  const enabled = Boolean(TURNSTILE_SITE_KEY);

  useEffect(() => {
    if (!enabled || !active) return;

    const renderWidget = () => {
      if (!window.turnstile || !widgetRef.current || widgetIdRef.current !== null) return;
      try {
        widgetIdRef.current = window.turnstile.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (t) => setToken(t),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      } catch {
        /* widget may already be rendered */
      }
    };

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      if (window.turnstile) {
        renderWidget();
      } else {
        existing.addEventListener("load", renderWidget);
      }
    } else {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = renderWidget;
      document.body.appendChild(script);
    }

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
      // A removed widget's token is unusable — clear it so a re-mounted step
      // disables Submit until the fresh widget issues a new token.
      setToken("");
    };
  }, [enabled, active]);

  const reset = () => {
    setToken("");
    if (widgetIdRef.current !== null && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {
        /* ignore */
      }
    }
  };

  return { widgetRef, token, reset, enabled };
}
