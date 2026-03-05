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
            ابدأ رحلة العمرة بسهولة
          </h2>
          <p className="text-xl md:text-2xl mb-12 leading-relaxed opacity-90">
            احجز الآن واحصل على خدمة نقل مباشر من المطار إلى الحرم الشريف
          </p>
          
          {/* Contact Options */}
          <div className="flex justify-center mb-12">
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
                  trackConversion.buttonClick("احجز الآن", "cta_section");
                  window.location.href = '/packages';
                }}
              >
                احجز الآن
              </Button>
             
           </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-white/80 text-lg">
              خدمة معتمدة ومرخصة - نقل أمتعة سلس - فريق محترف ومدرب
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;