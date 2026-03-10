import { MousePointerClick, CreditCard, Plane, SmilePlus } from "lucide-react";
const steps = [{
  icon: MousePointerClick,
  title: "اختر خدماتك",
  description: "تصفّح الخدمات المتاحة واختر ما يناسب رحلتك",
  number: "01"
}, {
  icon: CreditCard,
  title: "أكمل الحجز",
  description: "أتمم حجزك بخطوات يسيرة وآمنة",
  number: "02"
}, {
  icon: Plane,
  title: "وصولك إلى جدة",
  description: "نستقبلك في المطار ونوفر لك الخدمات التي اخترتها",
  number: "03"
}, {
  icon: SmilePlus,
  title: "عمرة بسكينة",
  description: "تفرّغ لعبادتك بخشوع ودعنا نتولى ما تبقّى",
  number: "04"
}];
const HowItWorks = () => {
  return <section dir="rtl" className="bg-background py-[60px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            كيف تبدأ رحلتك؟
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            أربع خطوات يسيرة نحو عمرة هادئة ومريحة
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
                    <div className="relative z-10 bg-card rounded-xl p-5 shadow-elegant hover:shadow-glow transition-smooth text-center">
                      {/* Step Number */}
                      <div className="absolute -top-3 right-4 w-6 h-6 primary-gradient rounded-full flex items-center justify-center text-primary-foreground font-bold text-xs">
                        {step.number}
                      </div>

                      {/* Icon */}
                      <div className="w-10 h-10 accent-gradient rounded-full flex items-center justify-center mx-auto mb-3">
                        <IconComponent className="w-5 h-5 text-accent-foreground" />
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-bold text-foreground mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
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