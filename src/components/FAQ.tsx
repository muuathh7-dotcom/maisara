import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "هل يجب حجز جميع الخدمات معًا؟",
    answer: "لا، يمكنك اختيار خدمة واحدة أو أكثر حسب حاجتك. كل خدمة مستقلة — اختر ما تحتاجه فقط."
  },
  {
    question: "ما الفرق بين النقل بالسيارة الخاصة والحافلة؟",
    answer: "السيارة الخاصة توفر نقلًا مباشرًا مع سائق خاص دون توقفات. والحافلة خيار اقتصادي بمواعيد منتظمة كل 15 دقيقة."
  },
  {
    question: "كيف تعمل خدمة الفنادق بالساعة؟",
    answer: "نوفر باقة 5 ساعات ثابتة بسعر 375 ر.س (75 ر.س للساعة) للراحة في غرف فندقية مريحة قبل العمرة أو بعدها، في فنادق 4 نجوم قريبة من مطار جدة."
  },
  {
    question: "هل يمكن إلغاء أو تعديل الحجز؟",
    answer: "نعم، يمكنك تعديل أو إلغاء أي خدمة محجوزة حتى في يوم الوصول. نوفر مرونة كاملة في إدارة حجوزاتك."
  },
  {
    question: "ما هي خدمة مرافق الفندق بدون إقامة؟",
    answer: "يمكنك الاستفادة من مرافق الفندق كالمسبح والصالة الرياضية ومنطقة الاستراحة دون حجز غرفة."
  },
  {
    question: "هل الخدمة مرخصة؟",
    answer: "نعم، جميع خدماتنا معتمدة ومرخصة من الجهات الرسمية. نعمل على مدار الساعة لضمان تجربة آمنة ومريحة."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 bg-background" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            الأسئلة الشائعة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            إجابات وافية على أكثر الأسئلة شيوعًا حول خدماتنا
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card rounded-lg shadow-elegant border-0 overflow-hidden"
              >
                <AccordionTrigger className="px-8 py-6 text-right hover:no-underline [&>svg]:mr-auto [&>svg]:ml-0">
                  <span className="text-lg font-semibold text-foreground text-right">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-right">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;