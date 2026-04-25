import OperationsClient from "./OperationsClient";

export const metadata = {
  title: "Operations — What it is like to drive for Forbes Logistix",
  description:
    "What the seat looks like at Forbes Logistix: open-deck freight in the Southeast, home most weekends, weekly direct deposit, dispatch that picks up the phone, modern equipment, Jackson MS terminal.",
  alternates: { canonical: "https://www.forbeslogistix.com/operations" },
  openGraph: {
    title: "Operations — What it is like to drive for Forbes Logistix",
    description:
      "What the seat looks like at Forbes Logistix: open-deck freight in the Southeast, home most weekends, weekly direct deposit, dispatch that picks up the phone, modern equipment, Jackson MS terminal.",
    url: "https://www.forbeslogistix.com/operations",
  },
};

export default function OperationsPage() {
  return <OperationsClient />;
}
