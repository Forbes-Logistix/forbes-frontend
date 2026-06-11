"use client";

import { MotionConfig } from "framer-motion";

// Makes every framer-motion animation respect the OS-level
// "prefers-reduced-motion" setting site-wide.
export default function MotionProvider({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
