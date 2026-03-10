import { Star, Quote } from "lucide-react";
const testimonials = [{
  name: "أحمد الغامدي",
  rating: 5,
  text: "اخترت النقل بالحافلة وكبينة التخزين وكانت التجربة ممتازة. كل شيء كان جاهزًا عند وصولي للمطار."
}, {
  name: "فاطمة السميري",
  rating: 5,
  text: "حجزت غرفة فندقية بالساعة وخدمة التحلل. ارتحت بعد العمرة ولم أحتج للبحث عن شيء آخر."
}, {
  name: "محمد القحطاني",
  rating: 5,
  text: "أفضل ما في الخدمة أنك تختار فقط ما تحتاجه. حجزت سيارة خاصة ومواقف المسار وكان كل شيء منظمًا."
}];
const Testimonials = () => {
  return <section dir="rtl" className="bg-muted/50 py-[40px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            تجارب معتمرين سبقوك
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            انطباعات من معتمرين وثقوا بنا في رحلاتهم
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => <div key={index} className="bg-card rounded-xl p-8 shadow-elegant hover:shadow-glow transition-smooth relative">
              {/* Quote Icon */}
              <div className="absolute -top-4 right-8">
                <div className="w-8 h-8 accent-gradient rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-accent-foreground" />
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-accent text-accent" />)}
              </div>
              
              {/* Testimonial Text */}
              <p className="text-foreground leading-relaxed text-lg mb-6 italic">
                "{testimonial.text}"
              </p>
              
              {/* Customer Info */}
              <div className="border-t border-border pt-4">
                <h4 className="font-bold text-foreground text-lg">
                  {testimonial.name}
                </h4>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Testimonials;