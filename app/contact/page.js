import ContactClient from "./ContactClient";

export const metadata = {
  title: "Contact Forbes Logistix — Jackson, MS dispatch and recruiting",
  description:
    "Reach Forbes Logistix dispatch and recruiting. 3180 Utica Ave, Jackson, MS 39209. Phone (601) 300-5529. Open 24/7.",
  alternates: { canonical: "https://www.forbeslogistix.com/contact" },
  openGraph: {
    title: "Contact Forbes Logistix — Jackson, MS dispatch and recruiting",
    description:
      "Reach Forbes Logistix dispatch and recruiting. 3180 Utica Ave, Jackson, MS 39209. Phone (601) 300-5529. Open 24/7.",
    url: "https://www.forbeslogistix.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
