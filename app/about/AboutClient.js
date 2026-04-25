"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutClient() {
  return (
    <div className="bg-black text-white">
      {/* ---------- HERO ---------- */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/assets/photos/terminal.jpg"
          alt="Forbes Logistix terminal in Jackson, Mississippi with company tractor parked outside"
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
          className="relative z-10 text-white max-w-3xl px-6 md:px-12 py-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl"
        >
          <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3 text-center">
            About Forbes Logistix
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight text-center">
            Built by people who understand trucking from behind the wheel, not just behind a desk.
          </h1>

          <div className="space-y-5 text-base md:text-lg leading-relaxed text-white/85">
            <p>
              Forbes Logistix is a veteran-owned, asset-based, driver-founded carrier headquartered in
              Jackson, Mississippi. We specialize in open-deck transportation and operate in one of the
              most capacity-constrained freight markets in the country.
            </p>
            <p>
              The company was founded by a former truck driver who also spent years in operations. Our
              leadership has sat behind the wheel and understands what the road actually looks like, not
              just what the spreadsheet says. That perspective shapes how we hire, dispatch, and pay.
            </p>
            <p>
              Our Jackson terminal sits on a 3-acre lot and includes a 25,000-square-foot warehouse,
              giving us the infrastructure to support our fleet and partners with strength and scale.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
