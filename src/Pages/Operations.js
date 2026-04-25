import React from "react";
import { motion } from "framer-motion";
import {
  FiTruck,
  FiHome,
  FiPhoneCall,
  FiDollarSign,
  FiTool,
  FiMapPin,
} from "react-icons/fi";
import Seo from "../Components/Seo/Seo";
import operationsBgImage from "../Components/Assets/operationsBg.jpg";

const sections = [
  {
    title: "Open-deck freight",
    icon: <FiTruck />,
    body:
      "We run flatbeds and step-decks on open-deck loads across the Southeast. The freight is steady, the lanes are real, and the customers expect drivers who know how to secure a load.",
  },
  {
    title: "Home most weekends",
    icon: <FiHome />,
    body:
      "Our lanes are built so company drivers can be home most weekends. We do not sell you 'flexible scheduling' &mdash; we plan dispatch around real home time.",
  },
  {
    title: "Dispatch that picks up the phone",
    icon: <FiPhoneCall />,
    body:
      "If you call dispatch, dispatch answers. No tickets, no chasing. We are a small enough company that the person you talk to has the authority to fix the problem.",
  },
  {
    title: "Weekly direct deposit, no surprises",
    icon: <FiDollarSign />,
    body:
      "Settlements run weekly with direct deposit. The numbers match what you were quoted: 30% of line haul, $100 tarp pay, and a dispatch-floor of $1,000/week if you are available.",
  },
  {
    title: "Modern, maintained equipment",
    icon: <FiTool />,
    body:
      "Modern tractors and well-kept open-deck trailers, serviced at our own shop in Jackson. If something breaks, we fix it. You should not be losing weeks to downtime.",
  },
  {
    title: "Jackson, MS terminal",
    icon: <FiMapPin />,
    body:
      "Our 3-acre terminal at 3180 Utica Ave includes a 25,000 sq ft warehouse and shop. Drop your trailer, park your truck, talk face-to-face with the people running the company.",
  },
];

const OperationsPage = () => {
  return (
    <div
      className="min-h-screen px-6 md:px-20 py-16 relative bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${operationsBgImage})` }}
    >
      <Seo
        title="Operations &mdash; What it is like to drive for Forbes Logistix"
        description="What the seat looks like at Forbes Logistix: open-deck freight in the Southeast, home most weekends, weekly direct deposit, dispatch that picks up the phone, modern equipment, Jackson MS terminal."
        path="/operations"
      />
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="uppercase tracking-widest text-white/60 text-sm font-bold mb-3">
            How we run
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            What the seat actually looks like.
          </h1>
          <p className="text-lg text-white/80">
            Forbes Logistix is built around the driver experience. Here is how that shows up day to day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {sections.map((section, idx) => (
            <motion.div
              key={section.title}
              className="flex items-start gap-5 bg-white/10 border border-white/20 text-white rounded-2xl p-6 md:p-8 backdrop-blur-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="w-14 h-14 shrink-0 rounded-full bg-black flex items-center justify-center border border-white/20">
                {React.cloneElement(section.icon, {
                  className: "text-white text-2xl",
                  "aria-hidden": true,
                })}
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-2">
                  {section.title}
                </h2>
                <p className="text-white/80 leading-relaxed">{section.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OperationsPage;
