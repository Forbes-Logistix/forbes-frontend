import Success from "../../src/Components/ApplyForm/Success";

export const metadata = {
  title: "Application Submitted — Forbes Logistix",
  description: "Your driver application has been submitted to Forbes Logistix.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return <Success />;
}
