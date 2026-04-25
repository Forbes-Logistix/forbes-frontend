import ContactClient from "./ContactClient";

const TITLE = "Recruiting Contact | Forbes Logistix";
const DESCRIPTION =
  "Call or email Forbes Logistix recruiting for company driver and owner-operator opportunities across the Southeast.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://www.forbeslogistix.com/contact" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://www.forbeslogistix.com/contact",
    images: [{ url: "/assets/photos/terminal.jpg" }],
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
