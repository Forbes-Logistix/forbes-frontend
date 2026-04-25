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
        <div className="max-w-4xl mx-auto space-y-4">
          <h2 className="text-xl font-bold tracking-wide text-black">Forbes Logistix</h2>
          <div className="flex justify-center gap-6 text-sm">
            <Link href="/about" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">About Us</Link>
            <Link href="/operations" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Operations</Link>
            <Link href="/careers" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Careers</Link>
            <Link href="/contact" className="relative text-black transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-full after:h-[1.5px] after:bg-black after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">Contact</Link>
          </div>
          <p className="text-xs text-gray-700">
            &copy; {new Date().getFullYear()} Forbes Logistix, LLC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
