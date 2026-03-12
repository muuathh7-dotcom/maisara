import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, DollarSign, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackConversion } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { getCustomerTrackingData } from "@/lib/customer-fingerprint";
import BookingProgress from "@/components/BookingProgress";

interface BookingService {
  id: string;
  title: string;
  price: number;
  priceLabel: string;
}

interface BookingData {
  services: BookingService[];
  passengers: number;
  departureDate: string | Date;
  totalPrice: number;
  preBookingId?: string | null;
  airlineName?: string;
  flightNumber?: string;
  arrivalTime?: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("apple-pay");
  const [isProcessing, setIsProcessing] = useState(false);

  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const passedBookingData: BookingData | undefined = location.state?.bookingData;

  // Build display data from the new services-based format
  const bookingData = passedBookingData
    ? {
        services: passedBookingData.services,
        passengers: passedBookingData.passengers,
        departureDate: passedBookingData.departureDate
          ? new Date(passedBookingData.departureDate).toLocaleDateString("en-GB")
          : "غير محدد",
        total: passedBookingData.totalPrice,
        preBookingId: passedBookingData.preBookingId,
      }
    : {
        services: [] as BookingService[],
        passengers: 1,
        departureDate: "غير محدد",
        total: 0,
        preBookingId: null,
      };

  const paymentMethods = [
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: <Smartphone className="w-5 h-5" />,
      description: "دفع سريع وآمن",
    },
    {
      id: "samsung-pay",
      name: "Samsung Pay",
      icon: <Smartphone className="w-5 h-5" />,
      description: "دفع سريع وآمن",
    },
    {
      id: "credit-card",
      name: "بطاقة ائتمان",
      icon: <CreditCard className="w-5 h-5" />,
      description: "بطاقة ائتمان أو بطاقة مدى",
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      icon: <DollarSign className="w-5 h-5" />,
      description: "تحويل فوري",
    },
  ];

  const saveBookingToDatabase = async (customerData: {
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      const trackingData = getCustomerTrackingData();
      const packageName = bookingData.services.map((s) => s.title).join(" + ");

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            customer_name: customerData.name,
            customer_phone: customerData.phone,
            customer_email: customerData.email,
            package_name: packageName,
            departure_date:
              passedBookingData?.departureDate
                ? new Date(passedBookingData.departureDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            return_date: new Date().toISOString().split("T")[0],
            adults: bookingData.passengers,
            children: 0,
            room_type: "غير محدد",
            departure_city: "غير محدد",
            total_price: bookingData.total,
            package_price: bookingData.total,
            savings: 0,
            wheelchair_service: false,
            extra_luggage: false,
            payment_method: paymentMethod,
            payment_status: "pending",
            booking_status: "pending",
            pre_booking_id: bookingData.preBookingId || null,
            ...trackingData,
          },
        ])
        .select("booking_reference");

      if (error) {
        console.error("Error saving booking:", error);
        throw error;
      }

      return data?.[0]?.booking_reference;
    } catch (error) {
      console.error("Error saving booking to database:", error);
      throw error;
    }
  };

  const handlePaymentProcess = async (customerData: {
    name: string;
    phone: string;
    email: string;
  }) => {
    try {
      await saveBookingToDatabase(customerData);

      trackConversion.paymentMethodSelected(paymentMethod, bookingData.total);

      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "فشل في الدفع",
        description:
          "سيقوم فريقنا بالتواصل معكم قريباً لإتمام عملية الدفع.",
        duration: 10000,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ الحجز",
        description:
          "حدث خطأ أثناء حفظ معلومات الحجز. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const handlePayment = async () => {
    const fullName = fullNameRef.current?.value.trim() || "";
    const phone = phoneRef.current?.value.trim() || "";
    const email = emailRef.current?.value.trim() || "";

    setIsProcessing(true);

    trackConversion.paymentMethodSelected(paymentMethod, bookingData.total);

    const customerData = {
      name: fullName || "مستخدم مجهول",
      phone: phone || "غير محدد",
      email: email || "غير محدد",
    };

    setTimeout(() => {
      handlePaymentProcess(customerData);
    }, 2000);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto py-8">
        {/* Progress */}
        <BookingProgress currentStep={4} />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">إتمام الحجز</h1>
          <p className="text-lg text-muted-foreground">
            مراجعة وتأكيد طلب الحجز
          </p>
        </div>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ملخص الحجز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Services list */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">الخدمات:</span>
              {bookingData.services.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span className="font-medium">{service.title}</span>
                  <span className="text-muted-foreground">
                    {service.priceLabel}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <span>عدد المسافرين:</span>
              <span>{bookingData.passengers} مسافر</span>
            </div>
            <div className="flex justify-between">
              <span>تاريخ الوصول:</span>
              <span>{bookingData.departureDate}</span>
            </div>

            {/* Flight info if provided */}
            {(passedBookingData?.airlineName || passedBookingData?.flightNumber || passedBookingData?.arrivalTime) && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-1.5">
                <span className="text-sm font-medium text-foreground">معلومات الرحلة:</span>
                {passedBookingData?.airlineName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">شركة الطيران</span>
                    <span>{passedBookingData.airlineName}</span>
                  </div>
                )}
                {passedBookingData?.flightNumber && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">رقم الرحلة</span>
                    <span dir="ltr">{passedBookingData.flightNumber}</span>
                  </div>
                )}
                {passedBookingData?.arrivalTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">وقت الوصول</span>
                    <span dir="ltr">{passedBookingData.arrivalTime}</span>
                  </div>
                )}
              </div>
            )}

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>الإجمالي:</span>
              <span className="text-primary">
                من {bookingData.total} ر.س
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              * الأسعار تبدأ من المبالغ المذكورة وقد تختلف حسب التفاصيل
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>معلومات الاتصال</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">الاسم كاملاً *</Label>
              <Input
                id="fullName"
                ref={fullNameRef}
                placeholder="أدخل الاسم الأول واسم العائلة"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input
                id="phone"
                ref={phoneRef}
                placeholder="+966 XX XXX XXXX"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input
                id="email"
                ref={emailRef}
                type="email"
                placeholder="example@email.com"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
              className="space-y-3"
            >
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center gap-3 flex-1">
                    {method.icon}
                    <div>
                      <Label
                        htmlFor={method.id}
                        className="font-medium cursor-pointer"
                      >
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ArrowRight className="w-4 h-4 ml-2" />
              رجوع
            </Button>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 primary-gradient text-primary-foreground font-bold"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري معالجة الدفع...
                </>
              ) : (
                <>
                  تأكيد الدفع - من {bookingData.total} ر.س
                </>
              )}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              تغيير الحجز وإلغاءه مجاني إلى يوم الوصول
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
