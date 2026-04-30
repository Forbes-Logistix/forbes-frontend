import Link from "next/link";
import { NAV_LINK } from "../lib/styles";

const Footer = () => {
  return (
    <footer className="bg-white w-full py-10 px-6 md:px-20 text-center text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        <h2 className="text-xl font-bold tracking-wide">Forbes Logistix</h2>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          <Link href="/about" className={NAV_LINK}>About Us</Link>
          <Link href="/operations" className={NAV_LINK}>Operations</Link>
          <Link href="/careers" className={NAV_LINK}>Careers</Link>
          <Link href="/contact" className={NAV_LINK}>Contact</Link>
        </nav>

        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-700">
          <Link href="/terms" className="hover:text-black hover:underline underline-offset-2">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-black hover:underline underline-offset-2">Privacy Policy</Link>
        </nav>

        <p className="text-xs text-gray-700">
          &copy; {new Date().getFullYear()} Forbes Logistix, LLC. All rights reserved.
        </p>

        <p className="text-xs text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Forbes Logistix is an Equal Opportunity Employer. All qualified applicants will receive
          consideration without regard to race, color, religion, sex, sexual orientation, gender
          identity, national origin, disability, or protected veteran status.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
