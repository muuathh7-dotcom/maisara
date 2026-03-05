import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "ما الفرق بين الباقة الأساسية والشاملة؟",
    answer: "الباقة الأساسية تشمل النقل المرن من المطار إلى الحرم مع رحلات كل 15 دقيقة، بينما الباقة الشاملة تشمل النقل بالإضافة إلى غرفة فندقية 4 نجوم بجوار المطار لمدة 5 ساعات للراحة بعد العمرة."
  },
  {
    question: "كم مرة تتوفر الرحلات من وإلى المطار؟",
    answer: "تتوفر رحلات متعددة كل 15 دقيقة لتقليل مدة الانتظار، مما يوفر لك مرونة كاملة في أوقات السفر دون الحاجة لحجز توقيت محدد."
  },
  {
    question: "ما الخدمات الإضافية المتاحة؟",
    answer: "نوفر خدمة دفع العربة للعمرة بواسطة فريق متخصص، وخدمة نقل الأمتعة للفنادق المجاورة للحرم لتوفير تجربة عمرة مريحة."
  },
  {
    question: "هل يمكن إلغاء أو استرداد الحجز؟",
    answer: "نعم، يمكنك إلغاء أي حجز حتى في نفس يوم الوصول. نحن نتفهم أن الخطط قد تتغير ونوفر مرونة كاملة في إلغاء الحجوزات."
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
            إجابات على أكثر الأسئلة التي يطرحها عملاؤنا حول خدمة استقبال المعتمرين
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