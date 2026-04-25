import ApplyForm from "../../src/Components/ApplyForm/ApplyForm";
import "../../src/Components/ApplyForm/formStyles.css";

export const metadata = {
  title: "Driver Application — Forbes Logistix",
  description:
    "Apply to drive for Forbes Logistix. Multi-step DOT-compliant flatbed driver application.",
  alternates: { canonical: "https://www.forbeslogistix.com/apply" },
  robots: { index: false, follow: true },
};

export default function ApplyPage() {
  return <ApplyForm />;
}
