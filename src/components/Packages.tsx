import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import hotelRoomImage from "@/assets/hotel-room.jpg";
import { trackConversion } from "@/lib/analytics";
import { PRICES } from "@/config/prices";
const packages = [{
  id: "transport-only",
  title: "الأساسية: نقل مرن",
  subtitle: "Basic Transportation Package",
  price: String(PRICES.packageBasic),
  duration: "ذهاب وعودة",
  features: ["نقل مرن ومباشر من المطار إلى بوابة الحرم", "رحلات متعددة كل 15 دقيقة لتقليل مدة الانتظار", "عودة سهلة وسريعة من مواقف برج الساعة في أي وقت", "فريق متخصص للاستقبال بالعربات لأداء العمرة (خدمة إضافية)"],
  color: "bg-accent",
  image: "/lovable-uploads/cac7fd97-c126-478e-bbef-50781b9e0be8.png",
  popular: false
}, {
  id: "express-vip",
  title: "الشاملة: نقل + راحة",
  subtitle: "Complete Package with Rest",
  price: String(PRICES.packageComplete),
  duration: "ذهاب وعودة",
  features: ["نقل مرن ومباشر من المطار إلى بوابة الحرم", "رحلات متعددة كل 15 دقيقة لتقليل مدة الانتظار", "غرفة فندقية 4 نجوم بجوار مطار جدة", "إقامة 5 ساعات مميزة شاملة ضيافة وقهوة سعودية", "مناشف وأدوات عناية شخصية ودورة مياه خاصة", "حفظ الأمتعة وإيصالها للغرفة أثناء أدائك للعمرة"],
  color: "bg-primary",
  image: hotelRoomImage,
  popular: true
}];
const Packages = () => {
  const navigate = useNavigate();
  const handleSelectPackage = (packageId: string) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      trackConversion.packageSelected(packageId, selectedPackage.title, parseInt(selectedPackage.price));
    }
    navigate(`/booking-details/${packageId}`);
  };
  return <section id="packages-section" dir="rtl" className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-[40px]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            باقاتنا المميزة
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            خدمة نقل مريحة وآمنة من المطار إلى الحرم الشريف
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {packages.map(pkg => <Card key={pkg.id} className="relative overflow-hidden group hover:shadow-glow transition-smooth border border-primary/10 bg-card/95 backdrop-blur-sm flex flex-col h-full">
                {pkg.popular && <div className="absolute top-6 left-6 z-10">
                    <Badge className="primary-gradient text-primary-foreground border-0 shadow-elegant">
                      <Star className="w-4 h-4 ml-1" />
                      الأكثر طلباً
                    </Badge>
                  </div>}
                
                <div className={`absolute top-0 left-0 right-0 h-2 ${pkg.color}`} />
                
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.image} alt={pkg.id === "transport-only" ? "باص فخم" : "غرفة فندقية"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                <CardHeader className="space-y-4 p-6 pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      {pkg.id === "transport-only" ? <div>
                          <div className="text-sm text-accent font-medium mb-1">الأساسية</div>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent mb-2"></div>
                          <CardTitle className="text-xl md:text-2xl mb-1 text-foreground">نقل مرن</CardTitle>
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            <Badge className="w-fit bg-primary/10 text-primary border border-primary/20">
                              <ArrowLeftRight className="w-4 h-4 ml-1" />
                              {pkg.duration}
                            </Badge>
                          </div>
                        </div> : <div>
                          <div className="text-sm text-accent font-medium mb-1">الشاملة</div>
                          <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent mb-2"></div>
                          <CardTitle className="text-xl md:text-2xl mb-1 text-foreground">نقل + غرفة فندقية</CardTitle>
                          <div className="text-sm text-muted-foreground">(5 ساعات راحة)</div>
                          <div className="flex items-center gap-2 flex-wrap mt-2">
                            <Badge className="w-fit bg-primary/10 text-primary border border-primary/20">
                              <ArrowLeftRight className="w-4 h-4 ml-1" />
                              {pkg.duration}
                            </Badge>
                          </div>
                        </div>}
                    </div>
                    
                    {/* Pricing Display */}
                    <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
                      <div className="text-3xl md:text-4xl font-black text-primary mb-1 leading-none">
                        {pkg.price}
                      </div>
                      <div className="text-xs text-muted-foreground">ريال سعودي</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col flex-grow p-6 pt-0">
                  <div className="space-y-3 flex-grow">
                    {pkg.features.map((feature, index) => <div key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-accent mt-1.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>)}
                  </div>

                  <Button onClick={() => handleSelectPackage(pkg.id)} className="w-full primary-gradient text-primary-foreground font-bold py-6 text-lg shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:scale-[1.02] rounded-xl mt-6">
                    احجز الآن
                  </Button>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </section>;
};
export default Packages;