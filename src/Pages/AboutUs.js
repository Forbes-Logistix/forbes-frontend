import React from "react";
import { motion } from "framer-motion";
import Seo from "../Components/Seo/Seo";
import truckBg from "../Components/Assets/truckBg.jpg";

const AboutPage = () => {
  return (
    <div className="text-black">
      <Seo
        title="About Forbes Logistix &mdash; Veteran-owned flatbed carrier in Jackson, MS"
        description="Veteran-owned, asset-based open-deck carrier headquartered in Jackson, MS. Founded by a former driver. 3-acre terminal with a 25,000 sq ft warehouse and shop."
        path="/aboutUs"
      />
      <section
        className="relative bg-cover bg-center bg-no-repeat min-h-screen flex items-center justify-center shadow-xl"
        style={{ backgroundImage: `url(${truckBg})` }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="relative z-10 text-white max-w-3xl px-6 md:px-12 py-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg"
        >
          <h1 className="text-2xl md:text-3xl font-extrabold mb-6 border-b border-white/30 pb-2 text-center">
            About Forbes Logistix
          </h1>
          <p className="text-sm md:text-base leading-relaxed text-white/90 mb-4">
            Forbes Logistix is a veteran-owned, asset-based carrier headquartered in Jackson, Mississippi.
            We specialize in open-deck transportation and operate in one of the most capacity-constrained
            freight markets in the country.
          </p>
          <p className="text-sm md:text-base leading-relaxed text-white/85 mb-4">
            Founded by a former truck driver who also spent years in operations, Forbes was built focused
            on the driver experience. Our leadership team has sat behind the wheel, so we understand the
            road firsthand, not just from a desk. That perspective shapes everything we do.
          </p>
          <p className="text-sm md:text-base leading-relaxed text-white/80">
            Our Jackson terminal sits on a 3-acre lot and includes a 25,000-square-foot warehouse and shop,
            giving us the infrastructure to support our fleet and partners with strength and scale.
          </p>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
