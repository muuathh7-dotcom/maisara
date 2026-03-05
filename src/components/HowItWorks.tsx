import { Plane, Luggage, Hotel, MapPin } from "lucide-react";
const steps = [{
  icon: Plane,
  title: "الاستقبال من المطار",
  description: "نستقبلك عند الوصول لمطار الملك عبدالعزيز الدولي بجدة",
  number: "01"
}, {
  icon: MapPin,
  title: "التوصيل إلى باب الحرم",
  description: "نوصلك مباشرة لباب الحرم لتبدأ عمرتك فوراً",
  number: "02"
}, {
  icon: Luggage,
  title: "نقل الأمتعة إلى الفندق",
  description: "نستلم أمتعتك ونتولى نقلها بأمان إلى الفندق",
  number: "03"
}, {
  icon: Plane,
  title: "العودة إلى المطار",
  description: "بعد انتهاء عمرتك، نعيدك بأمان إلى المطار",
  number: "04"
}];
const HowItWorks = () => {
  return <section dir="rtl" className="bg-background py-[60px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            كيف تعمل الخدمة؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            عملية بسيطة وسهلة في أربع خطوات تضمن لك رحلة مريحة وسلسة من وإلى المطار
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Mobile Version - Compact List */}
          <div className="block md:hidden">
            <div className="space-y-4">
              {steps.map((step, index) => {
              const IconComponent = step.icon;
              return <div key={index} className="flex items-center gap-4 bg-card rounded-lg p-4 shadow-elegant">
                    <div className="flex-shrink-0 w-10 h-10 accent-gradient rounded-full flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <div className="flex-shrink-0 w-6 h-6 primary-gradient rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                      {step.number}
                    </div>
                  </div>;
            })}
            </div>
          </div>

          {/* Desktop Version - Full Cards */}
          <div className="hidden md:block">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
              const IconComponent = step.icon;
              return <div key={index} className="relative">
                    {/* Connection Line */}
                    {index < steps.length - 1 && <div className="hidden lg:block absolute top-12 right-1/2 w-full h-0.5 bg-gradient-to-l from-primary to-accent z-0"></div>}
                    
                    {/* Step Card */}
                    <div className="relative z-10 bg-card rounded-xl p-4 shadow-elegant hover:shadow-glow transition-smooth text-center h-32 flex flex-col justify-center">
                      {/* Step Number */}
                      <div className="absolute -top-3 right-4 w-6 h-6 primary-gradient rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                        {step.number}
                      </div>
                      
                      {/* Icon */}
                      <div className="w-10 h-10 accent-gradient rounded-full flex items-center justify-center mx-auto mb-2">
                        <IconComponent className="w-5 h-5 text-accent-foreground" />
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;