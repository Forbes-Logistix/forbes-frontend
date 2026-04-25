import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="relative bg-beige-100 text-white font-sans"
      style={{
        backgroundImage: `url(/assets/HomeBackground.png)`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <footer className="bg-white w-full py-10 px-6 md:px-20 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <h2 className="text-xl font-bold tracking-wide text-black">Forbes Logistix</h2>

          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
            <Link href="/about" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About Us</Link>
            <Link href="/operations" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Operations</Link>
            <Link href="/careers" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Careers</Link>
            <Link href="/contact" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Contact</Link>
          </nav>

          <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-gray-700">
            <Link href="/terms" className="hover:text-black hover:underline underline-offset-2">Terms of Use</Link>
            <Link href="/privacy" className="hover:text-black hover:underline underline-offset-2">Privacy Policy</Link>
          </nav>

          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} Forbes Logistix, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
