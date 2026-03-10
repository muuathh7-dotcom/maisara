import { Users, Heart, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
const TargetSegments = () => {
  const isMobile = useIsMobile();
  const segments = [{
    icon: Users,
    title: "للشباب والمسافرين منفردين",
    description: "اختر خدمة النقل المناسبة واحجز كبينة تخزين لأمتعتك وأدِّ عمرتك بيسر وراحة.",
    benefits: ["خدمات مرنة تناسب المعتمر المنفرد", "ادفع فقط مقابل ما تحتاجه"]
  }, {
    icon: Heart,
    title: "للعائلات",
    description: "راحة لعائلتك من البداية — نقل خاص مع سائق وتخزين أمتعة ومواقف قريبة وغرف فندقية للاستراحة.",
    benefits: ["خدمات شاملة تلبي احتياجات العائلة", "اختاروا ما يناسبكم بمرونة تامة"]
  }, {
    icon: Shield,
    title: "للنساء",
    description: "نقل آمن ومريح مع خيار حجز غرفة فندقية أو استخدام مرافق الفندق للراحة قبل العمرة أو بعدها.",
    benefits: ["خصوصية وراحة مع خدمات مخصصة لاحتياجاتك", "خدمة معتمدة وموثوقة"]
  }];
  const SegmentCard = ({
    segment,
    index
  }: {
    segment: any;
    index: number;
  }) => {
    const Icon = segment.icon;
    if (isMobile) {
      return <Dialog key={index}>
          <DialogTrigger asChild>
            <div className="bg-card border border-border rounded-lg p-4 text-center hover:bg-primary/5 transition-colors cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">
                  {segment.title}
                </h3>
              </div>
            </div>
          </DialogTrigger>
          
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right flex items-center gap-3">
                <Icon className="w-6 h-6 text-primary" />
                {segment.title}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <p className="text-muted-foreground text-right">
                {segment.description}
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-right">المزايا الخاصة:</h4>
                <ul className="space-y-2">
                  {segment.benefits.map((benefit: string, benefitIndex: number) => <li key={benefitIndex} className="flex items-start gap-2 text-right">
                      <span className="text-primary text-xl leading-none">•</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>)}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>;
    }

    // Desktop version - show full details
    return <div className="bg-card border border-border rounded-lg p-6 text-right hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground">
              {segment.title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {segment.description}
          </p>
          <ul className="space-y-1.5">
            {segment.benefits.map((benefit: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>;
  };
  return <section dir="rtl" className="bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 text-foreground">
            خدمات تناسب كل معتمر
          </h2>
          <p className="text-muted-foreground">
            خدمات مرنة تلائم احتياجات كل فئة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {segments.map((segment, index) => <SegmentCard key={index} segment={segment} index={index} />)}
        </div>
      </div>
    </section>;
};
export default TargetSegments;