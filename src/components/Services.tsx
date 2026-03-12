import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check, ShoppingCart, ArrowLeft, ArrowRight, CircleOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackConversion } from "@/lib/analytics";
import BookingProgress from "@/components/BookingProgress";
import {
  TRANSPORT_SERVICES,
  ADDON_SERVICES,
  EXCLUSION_RULES,
  type ServiceConfig,
} from "@/lib/services-config";

type TransportChoice = "private-transfer" | "bus-transfer" | "none";

const Services = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [transportChoice, setTransportChoice] = useState<TransportChoice | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  // Compute disabled add-ons based on transport choice
  const { disabledAddons, disabledReasons } = useMemo(() => {
    const disabled = new Set<string>();
    const reasons = new Map<string, string>();

    if (transportChoice && transportChoice !== "none") {
      for (const rule of EXCLUSION_RULES) {
        if (rule.whenSelected === transportChoice) {
          for (const target of rule.disables) {
            // Only apply to addon services (transport exclusion handled by radio)
            if (ADDON_SERVICES.some((s) => s.id === target)) {
              disabled.add(target);
              reasons.set(target, rule.reason);
            }
          }
        }
      }
    }

    return { disabledAddons: disabled, disabledReasons: reasons };
  }, [transportChoice]);

  const toggleAddon = (id: string) => {
    if (disabledAddons.has(id)) return;
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleTransportSelect = (choice: TransportChoice) => {
    setTransportChoice(choice);
    // Clear addons that would be disabled by the new transport choice
    if (choice !== "none") {
      setSelectedAddons((prev) => {
        const next = new Set(prev);
        for (const rule of EXCLUSION_RULES) {
          if (rule.whenSelected === choice) {
            for (const target of rule.disables) {
              next.delete(target);
            }
          }
        }
        return next;
      });
    }
  };

  const handleNextStep = () => {
    if (transportChoice) {
      setCurrentStep(2);
      // Smooth scroll to the section top
      const section = document.getElementById("packages-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleBackStep = () => {
    setCurrentStep(1);
    const section = document.getElementById("packages-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContinue = () => {
    const allSelected: string[] = [];
    if (transportChoice && transportChoice !== "none") {
      allSelected.push(transportChoice);
    }
    allSelected.push(...Array.from(selectedAddons));

    if (allSelected.length > 0) {
      trackConversion.buttonClick("متابعة الحجز", "services_wizard");
      navigate(`/booking/${allSelected.join(",")}`);
    }
  };

  // Calculate running total
  const runningTotal = useMemo(() => {
    let total = 0;
    if (transportChoice && transportChoice !== "none") {
      const transport = TRANSPORT_SERVICES.find((s) => s.id === transportChoice);
      if (transport) total += transport.price;
    }
    for (const addonId of selectedAddons) {
      const addon = ADDON_SERVICES.find((s) => s.id === addonId);
      if (addon) total += addon.price;
    }
    return total;
  }, [transportChoice, selectedAddons]);

  const totalSelectedCount =
    (transportChoice && transportChoice !== "none" ? 1 : 0) + selectedAddons.size;

  const canContinueToBooking = totalSelectedCount > 0;

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
        <div className="text-center mb-10">
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

        {/* Progress bar */}
        <BookingProgress currentStep={currentStep} />

        {/* Step content */}
        <div className="max-w-4xl mx-auto">
          {/* ========== STEP 1: Transport ========== */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  كيف تفضّل الوصول؟
                </h3>
                <p className="text-muted-foreground">
                  اختر وسيلة النقل المناسبة من المطار إلى مكة المكرمة
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                {/* Transport options */}
                {TRANSPORT_SERVICES.map((service) => (
                  <TransportCard
                    key={service.id}
                    service={service}
                    isSelected={transportChoice === service.id}
                    onSelect={() =>
                      handleTransportSelect(service.id as TransportChoice)
                    }
                  />
                ))}

                {/* "No transport needed" option */}
                <button
                  onClick={() => handleTransportSelect("none")}
                  className={`
                    group relative text-right rounded-2xl p-5 transition-all duration-300 ease-out
                    border-2 bg-card
                    ${
                      transportChoice === "none"
                        ? "border-gray-500 shadow-lg scale-[1.02]"
                        : "border-border/60 hover:border-gray-400 hover:shadow-md"
                    }
                  `}
                >
                  {/* Selection indicator */}
                  <div
                    className={`
                      absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${
                        transportChoice === "none"
                          ? "bg-gray-600 scale-100"
                          : "bg-muted scale-90 group-hover:scale-100"
                      }
                    `}
                  >
                    <Check
                      className={`w-3.5 h-3.5 transition-all duration-200 ${
                        transportChoice === "none"
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
                        transportChoice === "none"
                          ? "bg-gray-100 text-gray-600"
                          : "bg-muted/60 text-muted-foreground"
                      }
                    `}
                  >
                    <CircleOff className="w-6 h-6" />
                  </div>

                  <h3
                    className={`font-bold text-base mb-2 transition-colors duration-300 ${
                      transportChoice === "none"
                        ? "text-foreground"
                        : "text-foreground/80"
                    }`}
                  >
                    لا أحتاج نقل
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    لديّ وسيلة نقل خاصة وأرغب فقط بالخدمات الأخرى
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`
                      absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-500
                      bg-gradient-to-l from-gray-500 to-gray-700
                      ${transportChoice === "none" ? "opacity-100" : "opacity-0 group-hover:opacity-30"}
                    `}
                  />
                </button>
              </div>

              {/* Next button */}
              <div className="flex justify-center">
                <Button
                  onClick={handleNextStep}
                  disabled={!transportChoice}
                  size="lg"
                  className="primary-gradient text-primary-foreground font-bold px-10 py-6 text-lg rounded-xl shadow-elegant hover:shadow-glow transition-all duration-300 disabled:opacity-50"
                >
                  التالي — اختر خدمات إضافية
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {/* ========== STEP 2: Add-on Services ========== */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  خدمات إضافية لراحتك
                </h3>
                <p className="text-muted-foreground">
                  اختر ما يناسبك من الخدمات التالية (اختياري)
                </p>
              </div>

              {/* Back button */}
              <button
                onClick={handleBackStep}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium mb-6 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                <span>رجوع لاختيار النقل</span>
              </button>

              {/* Add-on services grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                {ADDON_SERVICES.map((service) => {
                  const isSelected = selectedAddons.has(service.id);
                  const isDisabled = disabledAddons.has(service.id);
                  const disabledReason = disabledReasons.get(service.id);

                  return (
                    <AddonCard
                      key={service.id}
                      service={service}
                      isSelected={isSelected}
                      isDisabled={isDisabled}
                      disabledReason={disabledReason}
                      onToggle={() => toggleAddon(service.id)}
                    />
                  );
                })}
              </div>

              {/* Floating action bar */}
              <div className="sticky bottom-6 z-20">
                <div className="max-w-lg mx-auto bg-card/95 backdrop-blur-xl border border-border/80 rounded-2xl shadow-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="text-sm font-bold text-foreground">
                        {totalSelectedCount}
                      </span>
                      <span className="text-sm text-muted-foreground mr-1">
                        {totalSelectedCount === 1
                          ? "خدمة"
                          : totalSelectedCount === 2
                            ? "خدمتان"
                            : "خدمات"}
                      </span>
                      {runningTotal > 0 && (
                        <span className="text-xs text-primary font-bold block">
                          من {runningTotal} ر.س
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleContinue}
                    disabled={!canContinueToBooking}
                    className="primary-gradient text-primary-foreground font-bold px-8 py-5 text-base shadow-elegant hover:shadow-glow transition-all duration-300 rounded-xl disabled:opacity-50"
                  >
                    متابعة الحجز
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─── Transport Card ─── */
const TransportCard = ({
  service,
  isSelected,
  onSelect,
}: {
  service: ServiceConfig;
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const Icon = service.icon;

  return (
    <button
      onClick={onSelect}
      className={`
        group relative text-right rounded-2xl p-5 transition-all duration-300 ease-out
        border-2 bg-card
        ${
          isSelected
            ? `${service.borderColor.split(" ")[0].replace("-200", "-500")} shadow-lg scale-[1.02]`
            : `border-border/60 hover:border-primary/30 hover:shadow-md`
        }
      `}
    >
      {/* Selection indicator */}
      <div
        className={`
          absolute top-4 left-4 w-6 h-6 rounded-full flex items-center justify-center
          transition-all duration-300
          ${
            isSelected
              ? `${service.checkColor} scale-100`
              : "bg-muted scale-90 group-hover:scale-100"
          }
        `}
      >
        <Check
          className={`w-3.5 h-3.5 transition-all duration-200 ${
            isSelected
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
          ${isSelected ? service.iconBg : "bg-muted/60 text-muted-foreground"}
        `}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <h3
        className={`font-bold text-base mb-2 transition-colors duration-300 ${
          isSelected ? "text-foreground" : "text-foreground/80"
        }`}
      >
        {service.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {service.description}
      </p>
      <p
        className={`text-sm font-bold mt-2 ${
          isSelected ? "text-primary" : "text-primary/70"
        }`}
      >
        {service.priceLabel}
      </p>

      {/* Bottom accent line */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl transition-all duration-500
          bg-gradient-to-l ${service.accentColor}
          ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-30"}
        `}
      />
    </button>
  );
};

/* ─── Add-on Card ─── */
const AddonCard = ({
  service,
  isSelected,
  isDisabled,
  disabledReason,
  onToggle,
}: {
  service: ServiceConfig;
  isSelected: boolean;
  isDisabled: boolean;
  disabledReason?: string;
  onToggle: () => void;
}) => {
  const Icon = service.icon;

  return (
    <button
      onClick={onToggle}
      disabled={isDisabled}
      className={`
        group relative text-right rounded-2xl p-5 transition-all duration-300 ease-out
        border-2 bg-card
        ${
          isDisabled
            ? "opacity-50 cursor-not-allowed border-border/40 grayscale"
            : isSelected
              ? `${service.borderColor.split(" ")[0].replace("-200", "-500")} shadow-lg scale-[1.02]`
              : `border-border/60 hover:border-primary/30 hover:shadow-md`
        }
      `}
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
          isDisabled
            ? "text-foreground/40"
            : isSelected
              ? "text-foreground"
              : "text-foreground/80"
        }`}
      >
        {service.title}
      </h3>
      <p
        className={`text-sm leading-relaxed ${
          isDisabled ? "text-muted-foreground/40" : "text-muted-foreground"
        }`}
      >
        {service.description}
      </p>
      {!isDisabled && (
        <p
          className={`text-sm font-bold mt-2 ${
            isSelected ? "text-primary" : "text-primary/70"
          }`}
        >
          {service.priceLabel}
        </p>
      )}

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
          ${
            isDisabled
              ? "opacity-0"
              : isSelected
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-30"
          }
        `}
      />
    </button>
  );
};

export default Services;
