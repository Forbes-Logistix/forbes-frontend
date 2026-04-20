import React, { useState } from "react";
import { motion } from "framer-motion";
import contactBg from "../Components/Assets/contactBg.jpg";

const BACKEND_URL = "https://forbes-logistix-backend.vercel.app";

const ContactSection = () => {
      const [f, setF] = useState({ name: "", email: "", message: "" });
      const [s, setS] = useState("idle");
      const onC = (e) => setF({ ...f, [e.target.name]: e.target.value });
      const onS = async (e) => {
              e.preventDefault();
              setS("sending");
              try {
                        const r = await fetch(`${BACKEND_URL}/api/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
                        if (!r.ok) throw new Error("send failed");
                        setS("ok");
                        setF({ name: "", email: "", message: "" });
              } catch { setS("err"); }
      };
      return (<><section className="relative min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-6" style={{ backgroundImage: `url(${contactBg})` }}><div className="absolute inset-0 bg-black/40"></div><div className="relative z-10 grid md:grid-cols-2 gap-10 max-w-5xl w-full text-center"><motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-2xl shadow-xl p-10"><h3 className="text-2xl font-semibold mb-4">Head Office</h3><p className="text-white/90 mb-1">3180 Utica Ave</p><p className="text-white/90 mb-1">Jackson, MS 39209</p><p className="text-white/90 mb-1">Email: contact@forbeslogistix.com</p><p className="text-white/90">Phone: (601) 300-5529</p></motion.div><motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="bg-white/20 border border-white/20 backdrop-blur-sm text-white rounded-2xl shadow-xl p-10"><h3 className="text-2xl font-semibold mb-4">Operating Hours</h3><p className="text-white/90 leading-relaxed">Open 24 hours a day,<br />7 days a week,<br />365 days a year.</p></motion.div></div></section><section className="bg-gradient-to-b from-white py-24 px-6"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-3xl mx-auto bg-white/70 backdrop-blur-md border border-black/10 shadow-xl rounded-2xl p-10"><h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Send Us a Message</h2><form onSubmit={onS} className="space-y-6 text-left" noValidate><div><label className="block font-medium mb-1 text-gray-800">Your Name</label><input name="name" type="text" value={f.name} onChange={onC} required className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="Enter your name" /></div><div><label className="block font-medium mb-1 text-gray-800">Email Address</label><input name="email" type="email" value={f.email} onChange={onC} required className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="Enter your email" /></div><div><label className="block font-medium mb-1 text-gray-800">Message</label><textarea name="message" rows="5" value={f.message} onChange={onC} required className="w-full border border-gray-300 rounded-lg p-3 bg-white" placeholder="Type your message..." /></div>{s === "ok" && <p className="text-green-700 font-medium text-center">Thanks — your message was sent.</p>}{s === "err" && <p className="text-red-600 font-medium text-center">Something went wrong. Please call (601) 300-5529.</p>}<div className="text-center mt-10"><button type="submit" disabled={s === "sending"} className="bg-black text-white px-12 py-4 text-lg rounded-xl border border-white font-bold disabled:opacity-60">{s === "sending" ? "Sending..." : "Submit"}</button></div></form></motion.div></section></>);
};

export default ContactSection;
