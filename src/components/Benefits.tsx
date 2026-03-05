import { Shield, Clock, Heart, Zap } from "lucide-react";
import patternBg from "@/assets/pattern-bg.jpg";

const benefits = [
  {
    icon: Zap,
    title: "نقل مباشر للحرم",
    description: "نقل مباشر من المطار إلى الحرم الشريف دون توقف أو تأخير"
  },
  {
    icon: Clock,
    title: "خدمة موثوقة ومريحة",
    description: "خدمة نقل آمنة ومريحة مع إمكانية استخدام الكراسي المتحركة"
  },
  {
    icon: Heart,
    title: "غرفة راحة مميزة",
    description: "غرفة فندقية مخدومة 4 نجوم لمدة 5 ساعات قرب المطار مع وجبة واستحمام (الباقة الشاملة)"
  },
  {
    icon: Shield,
    title: "خدمة ذهاب وعودة",
    description: "نقل من المطار إلى الحرم الشريف ذهاباً وإياباً بأمان وراحة"
  }
];

const Benefits = () => {
  return (
    <section className="py-20 relative overflow-hidden" dir="rtl">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ 
          backgroundImage: `url(${patternBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            لماذا تختار خدمتنا؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            نحن نفهم أهمية رحلة العمرة ونعمل على جعلها أسهل وأكثر راحة لك
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <div 
                key={index}
                className="group bg-card rounded-xl p-8 shadow-elegant hover:shadow-glow transition-smooth"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 primary-gradient rounded-full flex items-center justify-center group-hover:scale-110 transition-bounce">
                      <IconComponent className="w-8 h-8 text-primary-foreground" />
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {benefit.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;