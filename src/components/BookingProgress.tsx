import { Check } from "lucide-react";

interface BookingProgressProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { number: 1, label: "النقل" },
  { number: 2, label: "الخدمات" },
  { number: 3, label: "التفاصيل" },
  { number: 4, label: "الدفع" },
];

const BookingProgress = ({ currentStep }: BookingProgressProps) => {
  return (
    <div dir="rtl" className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    transition-all duration-300
                    ${isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-primary/70"
                        : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mt-[-20px]">
                  <div
                    className={`h-0.5 rounded-full transition-all duration-300 ${
                      step.number < currentStep
                        ? "bg-primary"
                        : "bg-muted"
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingProgress;
