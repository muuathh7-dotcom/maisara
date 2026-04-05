import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToServices = () => {
    const el = document.getElementById("packages-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      dir="rtl"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
              scrolled
                ? "bg-primary text-primary-foreground"
                : "bg-white/20 text-white"
            }`}
          >
            UM
          </div>
          <span
            className={`font-bold text-lg transition-colors duration-300 ${
              scrolled ? "text-foreground" : "text-white"
            }`}
          >
            ميسرة
          </span>
        </div>

        {/* Right side: phone + CTA */}
        <div className="flex items-center gap-3">
          <a
            href="tel:+966503155948"
            className={`hidden sm:flex items-center gap-2 text-sm font-medium transition-colors duration-300 ${
              scrolled
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white"
            }`}
          >
            <Phone className="w-4 h-4" />
            <span dir="ltr">966 50 315 5948</span>
          </a>
          <Button
            onClick={scrollToServices}
            variant={scrolled ? "default" : "accent"}
            size="sm"
            className={`font-bold transition-all duration-300 ${
              scrolled ? "primary-gradient text-primary-foreground" : ""
            }`}
          >
            احجز الآن
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
