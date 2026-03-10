import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-16" dir="rtl">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 accent-gradient bg-clip-text text-transparent">
              خدمة استقبال المعتمرين
            </h3>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              نوفر خدمات متكاملة للمعتمرين في جدة — من النقل والتخزين إلى
              الراحة الفندقية وخدمات التحلل. اختر ما يناسبك لعمرة مريحة.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 accent-gradient rounded-full flex items-center justify-center">
                <span className="text-accent-foreground font-bold">UM</span>
              </div>
              <div>
                <p className="font-semibold">Umrah Meet & Greet</p>
                <p className="text-primary-foreground/60 text-sm">خدمة معتمدة ومرخصة</p>
              </div>
            </div>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-4">تواصل معنا</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span>مطار الملك عبدالعزيز الدولي، جدة</span>
              </div>
              <a href="https://wa.me/966500000000" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-accent transition-colors">
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span>واتساب: 966 50 000 0000</span>
              </a>
              <a href="tel:+966500000000" className="flex items-center gap-3 hover:text-accent transition-colors">
                <Phone className="w-5 h-5 text-accent" />
                <span>اتصل: 966 50 000 0000</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span>24/7 - على مدار الساعة</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60">
              © 2026 خدمة استقبال المعتمرين. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-primary-foreground/60">
              <a href="#" className="hover:text-accent transition-smooth">الشروط والأحكام</a>
              <a href="#" className="hover:text-accent transition-smooth">سياسة الخصوصية</a>
              <a href="#" className="hover:text-accent transition-smooth">اتصل بنا</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;