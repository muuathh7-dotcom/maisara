import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import TargetSegments from "@/components/TargetSegments";
import HowItWorks from "@/components/HowItWorks";
import Services from "@/components/Services";
import ServicesShowcase from "@/components/ServicesShowcase";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
const Index = () => {
  return <div className="min-h-screen">
      <Navbar />
      <WhatsAppButton />
      <div className="hero-gradient">
        <Hero />
      </div>
      <div className="py-[20px]">
        <HowItWorks />
      </div>
      <div className="py-[8px]">
        <ServicesShowcase />
      </div>
      <div className="py-[6px]">
        <Services />
      </div>
      <div className="py-[30px]">
        <TargetSegments />
      </div>
      <div className="py-[20px]">
        <Testimonials />
      </div>
      <div className="py-[20px]">
        <FAQ />
      </div>
      <div className="py-0">
        <CTA />
      </div>
      <Footer />
    </div>;
};
export default Index;