"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutClient() {
  return (
    <div className="bg-black text-white">
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/photos/truck-mountain.jpg"
          alt="Forbes Logistix flatbed truck loading freight on a Western plain with Rocky Mountains in the background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          // No card/border/glass treatment — text sits directly on the dark
          // overlay so the mountain photo reads through. Matches the
          // treatment used on the lower terminal credibility band, and on
          // the home page's terminal band.
          className="relative z-10 text-white max-w-3xl px-6 md:px-12"
        >
          <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3 text-center">
            About Forbes Logistix
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-center">
            Built by people who understand trucking from behind the wheel, not just behind a desk.
          </h1>

          <div className="space-y-5 text-base md:text-lg leading-relaxed text-white/85">
            <p>
              Forbes Logistix is a Marine Corps veteran-owned, asset-based, driver-founded carrier
              headquartered in Jackson, Mississippi. We specialize in open-deck transportation and
              operate in one of the most capacity-constrained freight markets in the country.
            </p>
            <p>
              The company was founded by Chase Forbes, a former truck driver with eight years behind
              the wheel and additional time in operations. Our leadership has sat behind the wheel and
              understands what the road actually looks like, not just what the spreadsheet says. That
              perspective shapes how we hire, dispatch, and pay.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ---------- TERMINAL CREDIBILITY BAND ----------
          Pulled the original third paragraph (terminal description) out of the
          hero card and into its own band with the terminal photo as background.
          Lets the mountain hero do "we drive real distances" without competing
          with terminal-specific copy, and gives the terminal photo the role
          where it fits best — a credibility statement about the home base.
          Mirrors the same pattern used on the home page. */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden">
        <Image
          src="/assets/photos/terminal.jpg"
          alt="Forbes Logistix terminal in Jackson, Mississippi with company tractor parked outside"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/65 flex items-center">
          <div className="max-w-5xl mx-auto px-6 text-white">
            <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
              Jackson, Mississippi
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
              A real terminal. A real company.
            </h2>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl">
              Our Jackson terminal sits on a 3-acre lot and includes a 25,000-square-foot warehouse,
              giving us the infrastructure to support our fleet and partners with strength and scale.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
