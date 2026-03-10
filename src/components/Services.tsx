import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Bus,
  ParkingCircle,
  Scissors,
  Package,
  Hotel,
  Dumbbell,
  Check,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackConversion } from "@/lib/analytics";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accentColor: string;
  iconBg: string;
  borderColor: string;
  checkColor: string;
}

const services: Service[] = [
  {
    id: "private-transfer",
    title: "نقل خاص من وإلى المطار",
    description: "سيارة خاصة مع سائق محترف توصلك بأمان وراحة تامة",
    icon: Car,
    accentColor: "from-emerald-600 to-emerald-800",
    iconBg: "bg-emerald-50 text-emerald-700",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    checkColor: "bg-emerald-600",
  },
  {
    id: "bus-transfer",
    title: "نقل بالحافلة من وإلى المطار",
    description: "حافلات مكيّفة ومريحة بمواعيد منتظمة كل 15 دقيقة",
    icon: Bus,
    accentColor: "from-teal-600 to-teal-800",
    iconBg: "bg-teal-50 text-teal-700",
    borderColor: "border-teal-200 hover:border-teal-400",
    checkColor: "bg-teal-600",
  },
  {
    id: "parking",
    title: "حجز مواقف المسار",
    description: "مواقف آمنة بالقرب من الحرم الشريف لراحتك",
    icon: ParkingCircle,
    accentColor: "from-blue-600 to-blue-800",
    iconBg: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-200 hover:border-blue-400",
    checkColor: "bg-blue-600",
  },
  {
    id: "tahallul",
    title: "خدمات التحلل والقص",
    description: "خدمة حلاقة وتقصير بعد أداء مناسك العمرة",
    icon: Scissors,
    accentColor: "from-violet-600 to-violet-800",
    iconBg: "bg-violet-50 text-violet-700",
    borderColor: "border-violet-200 hover:border-violet-400",
    checkColor: "bg-violet-600",
  },
  {
    id: "storage",
    title: "كبائن التخزين",
    description: "كبائن آمنة لحفظ أمتعتك طوال فترة العمرة",
    icon: Package,
    accentColor: "from-amber-600 to-amber-800",
    iconBg: "bg-amber-50 text-amber-700",
    borderColor: "border-amber-200 hover:border-amber-400",
    checkColor: "bg-amber-600",
  },
  {
    id: "hourly-hotel",
    title: "فنادق بالساعة",
    description: "غرف فندقية مريحة للاستراحة بالساعة قبل العمرة أو بعدها",
    icon: Hotel,
    accentColor: "from-rose-600 to-rose-800",
    iconBg: "bg-rose-50 text-rose-700",
    borderColor: "border-rose-200 hover:border-rose-400",
    checkColor: "bg-rose-600",
  },
  {
    id: "hotel-facilities",
    title: "مرافق فندقية بدون إقامة",
    description: "استفد من مرافق الفندق دون الحاجة لحجز غرفة",
    icon: Dumbbell,
    accentColor: "from-cyan-600 to-cyan-800",
    iconBg: "bg-cyan-50 text-cyan-700",
    borderColor: "border-cyan-200 hover:border-cyan-400",
    checkColor: "bg-cyan-600",
  },
];

const exclusionRules = [
  {
    whenSelected: "private-transfer",
    disables: ["bus-transfer", "parking"],
    reason: "غير متاح مع خدمة النقل الخاص",
  },
  {
    whenSelected: "bus-transfer",
    disables: ["private-transfer"],
    reason: "غير متاح مع خدمة النقل بالحافلة",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());

  const { disabledServices, disabledReasons } = useMemo(() => {
    const disabled = new Set<string>();
    const reasons = new Map<string, string>();
    for (const rule of exclusionRules) {
      if (selectedServices.has(rule.whenSelected)) {
        for (const target of rule.disables) {
          disabled.add(target);
          reasons.set(target, rule.reason);
        }
      }
    }
    return { disabledServices: disabled, disabledReasons: reasons };
  }, [selectedServices]);

  const toggleService = (id: string) => {
    if (disabledServices.has(id)) return;
    setSelectedServices((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        for (const rule of exclusionRules) {
          if (rule.whenSelected === id) {
            for (const target of rule.disables) {
              next.delete(target);
            }
          }
        }
      }
      return next;
    });
  };

  const handleContinue = () => {
    if (selectedServices.size > 0) {
      const ids = Array.from(selectedServices);
      trackConversion.buttonClick("متابعة الحجز", "services_section");
      navigate(`/booking-details/${ids.join(",")}`);
    }
  };

  return (
    <section
      id="packages-section"
      dir="rtl"
      className="relative py-20 overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-accent/[0.03]" />
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23064e3b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-5 py-2 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-semibold text-primary">
              خدمات لراحتك
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
            خدماتنا لراحتك
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            اختر من خدماتنا ما يلائم رحلتك لتنعم بعمرة هادئة
          </p>
        </div>

        {/* Services grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {services.map((service, index) => {
            const isSelected = selectedServices.has(service.id);
            const isDisabled = disabledServices.has(service.id);
            const disabledReason = disabledReasons.get(service.id);
            const Icon = service.icon;

            return (
              <button
                key={service.id}
                onClick={() => toggleService(service.id)}
                disabled={isDisabled}
                className={`
                  group relative text-right rounded-2xl p-5 transition-all duration-300 ease-out
                  border-2 bg-card
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed border-border/40 grayscale"
                      : isSelected
                        ? `${service.borderColor.split(" ")[0].replace("border-", "border-").replace("-200", "-500")} shadow-lg scale-[1.02] border-2`
                        : `border-border/60 hover:border-primary/30 hover:shadow-md`
                  }
                `}
                style={{
                  animationDelay: `${index * 60}ms`,
                }}
              >
                {/* Selection indicator */}
                <div
                  className={`
                    absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${
                      isDisabled
                        ? "bg-muted scale-90"
                        : isSelected
                          ? `${service.checkColor} scale-100`
                          : "bg-muted scale-90 group-hover:scale-100"
                    }
                  `}
                >
                  <Check
                    className={`w-3.5 h-3.5 transition-all duration-200 ${
                      isSelected && !isDisabled
                        ? "text-white opacity-100"
                        : "text-muted-foreground/40 opacity-0 group-hover:opacity-60"
                    }`}
                  />
                </div>

                {/* Icon */}
                <div
                  className={`
                    w-12 h-12 rounded-xl flex items-center justify-center mb-4
                    transition-all duration-300
                    ${
                      isDisabled
                        ? "bg-muted/40 text-muted-foreground/40"
                        : isSelected
                          ? service.iconBg
                          : "bg-muted/60 text-muted-foreground"
                    }
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3
                  className={`font-bold text-base mb-2 transition-colors duration-300 ${
                    isDisabled ? "text-foreground/40" : isSelected ? "text-foreground" : "text-foreground/80"
                  }`}
                >
                  {service.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDisabled ? "text-muted-foreground/40" : "text-muted-foreground"
                }`}>
                  {service.description}
                </p>

                {/* Disabled reason */}
                {isDisabled && disabledReason && (
                  <div className="mt-3 text-xs text-muted-foreground/60 bg-muted/30 rounded-lg px-3 py-1.5 text-center">
                    {disabledReason}
                  </div>
                )}

                {/* Bottom accent line */}
                <div
                  className={`
                    absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-500
                    bg-gradient-to-l ${service.accentColor}
                    ${isDisabled ? "opacity-0" : isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30"}
                  `}
                />
              </button>
            );
          })}
        </div>

        {/* Floating action bar */}
        <div
          className={`
            sticky bottom-6 z-20 transition-all duration-500 ease-out
            ${selectedServices.size > 0 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <div className="max-w-lg mx-auto bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-bold text-foreground">
                  {selectedServices.size}
                </span>
                <span className="text-sm text-muted-foreground mr-1">
                  {selectedServices.size === 1 ? "خدمة" : selectedServices.size === 2 ? "خدمتان" : "خدمات"} محددة
                </span>
              </div>
            </div>
            <Button
              onClick={handleContinue}
              className="primary-gradient text-primary-foreground font-bold px-8 py-5 text-base shadow-elegant hover:shadow-glow transition-all duration-300 rounded-xl"
            >
              متابعة الحجز
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
