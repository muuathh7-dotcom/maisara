import { SERVICES } from "@/lib/services-config";
import { Button } from "@/components/ui/button";

const ServicesShowcase = () => {
  const handleBookNow = () => {
    const section = document.getElementById("packages-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section dir="rtl" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2 mb-5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">خدماتنا</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            كل ما تحتاجه لعمرة مريحة
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            اختر من خدماتنا ما يناسب رحلتك — ادفع فقط مقابل ما تحتاجه
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-card border border-border rounded-2xl p-5 text-right hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${service.iconBg}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.description}</p>
                <span className="text-sm font-bold text-primary">{service.priceLabel}</span>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Button
            onClick={handleBookNow}
            size="lg"
            className="primary-gradient text-primary-foreground font-bold px-10 py-6 text-lg rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            احجز خدماتك الآن
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
