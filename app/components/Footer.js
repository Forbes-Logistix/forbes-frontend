import Link from "next/link";
import { NAV_LINK } from "../lib/styles";

const Footer = () => {
  return (
    <footer className="bg-white w-full py-10 px-6 md:px-20 text-center text-black font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        <h2 className="text-xl font-bold tracking-wide">Forbes Logistix</h2>

        {/* Recruiting phone, one tap from any page bottom. inline-block +
            py-2 grows the tap target past 44px. */}
        <p className="text-sm">
          <a href="tel:+16013005529" className="inline-block py-2 font-semibold hover:underline underline-offset-2">
            Recruiting: (601) 300-5529
          </a>
        </p>

        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
          <Link href="/about" className={NAV_LINK}>About Us</Link>
          <Link href="/operations" className={NAV_LINK}>Operations</Link>
          <Link href="/careers" className={NAV_LINK}>Flatbed Jobs</Link>
          <Link href="/reefer" className={NAV_LINK}>Reefer Jobs (Dallas)</Link>
          <Link href="/contact" className={NAV_LINK}>Contact</Link>
        </nav>

        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-700">
          <Link href="/terms" className="hover:text-black hover:underline underline-offset-2">Terms of Use</Link>
          <Link href="/privacy" className="hover:text-black hover:underline underline-offset-2">Privacy Policy</Link>
        </nav>

        <p className="text-xs text-gray-700">
          &copy; {new Date().getFullYear()} Forbes Logistix, LLC. All rights reserved.
        </p>

        {/* Drivers vet carriers on FMCSA — publishing the numbers saves them
            the hunt and signals we have nothing to hide. Verified against
            SAFER 2026-06-11. */}
        <p className="text-xs text-gray-700 font-medium">
          USDOT 4361817 &middot; MC 1706978
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
