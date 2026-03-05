import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, MapPin, ArrowLeftRight, Hotel, Luggage } from "lucide-react";
import hotelRoomImage from "@/assets/hotel-room.jpg";

const PackageSelection = () => {
  const navigate = useNavigate();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const packages = [
    {
      id: "transport-only",
      title: "الأساسية: نقل مرن",
      subtitle: "Basic Transportation Package",
      originalPrice: "196",
      price: "98",
      duration: "ذهاب وعودة",
      features: [
        "نقل مرن ومباشر من المطار إلى بوابة الحرم",
        "رحلات متعددة كل 15 دقيقة لتقليل مدة الانتظار",
        "عودة سهلة وسريعة من مواقف برج الساعة في أي وقت",
        "فريق متخصص للاستقبال بالعربات لأداء العمرة (خدمة إضافية)"
      ],
      color: "bg-accent",
      image: "/lovable-uploads/cac7fd97-c126-478e-bbef-50781b9e0be8.png"
    },
    {
      id: "express-vip",
      title: "الشاملة: نقل + راحة",
      subtitle: "Complete Package with Rest",
      originalPrice: "498",
      price: "249",
      duration: "ذهاب وعودة",
      features: [
        "نقل مرن ومباشر من المطار إلى بوابة الحرم",
        "رحلات متعددة كل 15 دقيقة لتقليل مدة الانتظار",
        "غرفة فندقية 4 نجوم بجوار مطار جدة",
        "إقامة 5 ساعات مميزة شاملة ضيافة وقهوة سعودية",
        "مناشف وأدوات عناية شخصية ودورة مياه خاصة",
        "حفظ الأمتعة وإيصالها للغرفة أثناء أدائك للعمرة"
      ],
      color: "bg-primary",
      image: hotelRoomImage
    }
  ];

  const handleContinue = () => {
    if (selectedPackage) {
      navigate(`/booking-details/${selectedPackage}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-destructive/10 border border-destructive/20 rounded-full px-6 py-3 mb-6">
            <Clock className="w-5 h-5 text-destructive" />
            <span className="text-destructive font-semibold">
              عرض خاص - خصم 50% لفترة محدودة!
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">اختر باقة العمرة المناسبة</h1>
          <p className="text-lg text-muted-foreground">خدمة نقل مريحة وآمنة من المطار إلى الحرم الشريف</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                selectedPackage === pkg.id 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md hover:scale-102'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-destructive text-destructive-foreground border-0 shadow-lg font-bold">
                  خصم 50%
                </Badge>
              </div>
              <div className={`absolute top-0 left-0 right-0 h-2 ${pkg.color}`} />
              
              <div className="relative h-48 overflow-hidden rounded-t-lg">
                <img 
                  src={pkg.image} 
                  alt={pkg.id === "transport-only" ? "باص فخم" : "غرفة فندقية"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    {pkg.id === "transport-only" ? (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">الأساسية</div>
                        <div className="w-8 h-px bg-border mb-2"></div>
                        <CardTitle className="text-xl md:text-2xl mb-1">نقل مرن</CardTitle>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">الشاملة</div>
                        <div className="w-8 h-px bg-border mb-2"></div>
                        <CardTitle className="text-xl md:text-2xl mb-1">نقل + غرفة فندقية <span className="text-sm text-muted-foreground">(5 ساعات)</span></CardTitle>
                      </div>
                    )}
                  </div>
                   <div className="text-left">
                     <div className="text-sm text-muted-foreground line-through mb-1">
                       {pkg.originalPrice} ريال
                     </div>
                     <div className="text-2xl md:text-3xl font-bold text-destructive">{pkg.price}</div>
                     <div className="text-sm text-muted-foreground">ريال سعودي</div>
                     <div className="text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded-full font-bold mt-1">
                       وفر {parseInt(pkg.originalPrice) - parseInt(pkg.price)} ريال
                     </div>
                   </div>
                </div>
                <Badge variant="secondary" className="w-fit">
                  <ArrowLeftRight className="w-3 h-3 ml-1" />
                  {pkg.duration}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedPackage}
            size="lg"
            className="px-8 py-3 text-lg"
          >
            متابعة الحجز
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PackageSelection;