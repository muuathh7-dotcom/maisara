import { Button } from "@/components/ui/button";
import { Lock, Check, MapPin, Clock, Star, ArrowLeftRight } from "lucide-react";
import { trackConversion, trackTrafficSource } from "@/lib/analytics";
import { useEffect } from "react";
const Hero = () => {
  useEffect(() => {
    // Defer analytics after initial render to improve FCP
    const timer = setTimeout(() => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => trackTrafficSource());
      } else {
        setTimeout(() => trackTrafficSource(), 100);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCTAClick = () => {
    trackConversion.buttonClick("اختر الباقة الآن", "hero_section");
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden" dir="rtl">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(/kaaba-hero.jpg)`
    }}>
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
        
        {/* Animated Pilgrims Circling */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-96 h-96 md:w-[500px] md:h-[500px]">
            {/* Outer circle of pilgrims */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '60s' }}>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 30}deg) translateY(-190px) translateX(-1px)`,
                  }}
                />
              ))}
            </div>
            
            {/* Inner circle of pilgrims */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '45s' }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-140px) translateX(-1px)`,
                  }}
                />
              ))}
            </div>
            
            {/* Very inner circle */}
            <div className="absolute inset-0 animate-spin" style={{ animationDuration: '30s' }}>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-white/50 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 60}deg) translateY(-90px) translateX(-1px)`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-8">
            <Check className="w-4 h-4" />
            <span className="font-medium">خدمة نقل مرخصة</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{
          lineHeight: '1.3'
        }}>
            من المطار إلى باب الحرم
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90 max-w-3xl mx-auto">
            خدمة نقل مباشر من المطار إلى الحرم الشريف مع إمكانية الحصول على غرفة راحة لمدة 5 ساعات
          </p>
          
          {/* Rating */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-5 h-5 fill-accent text-accent" 
                />
              ))}
            </div>
            <span className="font-bold text-lg">4.7</span>
            <span className="text-white/80">•</span>
            <span className="text-white/80">(5,851 تقييم)</span>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="font-medium">توصيل مباشر للحرم</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <Clock className="w-5 h-5 text-accent" />
              <span className="font-medium">خدمة على مدار الساعة</span>
            </div>
            <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <ArrowLeftRight className="w-5 h-5 text-accent" />
              <span className="font-medium">استقبال من المطار</span>
            </div>
          </div>
          
           {/* CTA Buttons */}
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="lg" className="text-xl md:text-2xl px-12 py-8 md:px-16 md:py-10" onClick={handleCTAClick}>
              اختر الباقة الآن
            </Button>
           </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>;
};
export default Hero;