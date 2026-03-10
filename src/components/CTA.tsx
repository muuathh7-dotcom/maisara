import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { trackConversion } from "@/lib/analytics";

const CTA = () => {
  return (
    <section className="py-20 hero-gradient relative overflow-hidden" dir="rtl">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            ابدأ رحلتك بطمأنينة
          </h2>
          <p className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90">
            اختر خدماتك ودعنا نتولى التفاصيل لتتفرغ لعبادتك
          </p>
          
          {/* Contact Options */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <a
              href="https://wa.me/966500000000?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]/20 hover:bg-[#25D366]/30 backdrop-blur-sm rounded-lg p-6 max-w-sm transition-colors"
            >
              <MessageCircle className="w-8 h-8 text-[#25D366] mx-auto mb-3" />
              <h3 className="font-bold mb-2">واتساب</h3>
              <p className="text-white/80">تواصل فوري</p>
            </a>
            <a
              href="tel:+966500000000"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-sm transition-colors"
            >
              <Phone className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">اتصل بنا</h3>
              <p className="text-white/80 direction-ltr">+966 50 000 0000</p>
            </a>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-sm">
              <Mail className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-bold mb-2">البريد الإلكتروني</h3>
              <p className="text-white/80">info@umrahmeet.sa</p>
            </div>
          </div>
          
           {/* Main CTA */}
           <div className="space-y-6">
              <Button 
                variant="accent" 
                size="lg" 
                className="text-xl px-12 py-8 font-bold"
                onClick={() => {
                  trackConversion.buttonClick("اختر خدماتك", "cta_section");
                  const servicesSection = document.getElementById('packages-section');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    window.location.href = '/';
                  }
                }}
              >
                اختر خدماتك
              </Button>
             
           </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 text-lg">
              خدمة معتمدة ومرخصة — نقل وتخزين وفنادق وغيرها — كل ما تحتاجه في مكان واحد
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;