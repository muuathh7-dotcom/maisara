import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, DollarSign, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackConversion } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { getCustomerTrackingData } from "@/lib/customer-fingerprint";


const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("apple-pay");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form refs for validation
  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Get booking data from navigation state or use defaults
  const passedBookingData = location.state?.bookingData;
  const bookingData = passedBookingData ? {
    package: passedBookingData.packageTitle,
    tripType: passedBookingData.tripType === "roundtrip" ? "ذهاب وعودة" : "رحلة واحدة",
    passengers: passedBookingData.passengers,
    departureDate: passedBookingData.departureDate ? 
      new Date(passedBookingData.departureDate).toLocaleDateString('en-GB') : "غير محدد",
    returnDate: passedBookingData.returnDate ? 
      new Date(passedBookingData.returnDate).toLocaleDateString('ar-SA') : "غير محدد",
    originalPrice: passedBookingData.packageId === "transport-only" ? 196 : 498,
    basePrice: passedBookingData.basePrice,
    savings: (passedBookingData.packageId === "transport-only" ? 196 : 498) - passedBookingData.basePrice,
    wheelchairService: passedBookingData.wheelchairService,
    luggageService: passedBookingData.luggageService,
    wheelchairPrice: passedBookingData.wheelchairPrice || 0,
    luggagePrice: passedBookingData.luggagePrice || 0,
    total: passedBookingData.totalPrice || (passedBookingData.basePrice * passedBookingData.passengers)
  } : {
    // Fallback data if no state passed
    package: "نقل + غرفة فندقية",
    tripType: "ذهاب وعودة", 
    passengers: 1,
    departureDate: "غير محدد",
    returnDate: "غير محدد",
    originalPrice: 498,
    basePrice: 249,
    savings: 249,
    wheelchairService: false,
    luggageService: false,
    wheelchairPrice: 0,
    luggagePrice: 0,
    total: 249
  };

  const paymentMethods = [
    {
      id: "apple-pay",
      name: "Apple Pay",
      icon: <Smartphone className="w-5 h-5" />,
      description: "دفع سريع وآمن"
    },
    {
      id: "samsung-pay",
      name: "Samsung Pay", 
      icon: <Smartphone className="w-5 h-5" />,
      description: "دفع سريع وآمن"
    },
    {
      id: "credit-card",
      name: "بطاقة ائتمان",
      icon: <CreditCard className="w-5 h-5" />,
      description: "بطاقة ائتمان أو بطاقة مدى"
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      icon: <DollarSign className="w-5 h-5" />,
      description: "تحويل فوري"
    }
  ];

  const saveBookingToDatabase = async (customerData: { 
    name: string; 
    phone: string; 
    email: string; 
  }) => {
    try {
      const trackingData = getCustomerTrackingData();
      
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            customer_name: customerData.name,
            customer_phone: customerData.phone,
            customer_email: customerData.email,
            package_name: bookingData.package,
            departure_date: passedBookingData?.departureDate || new Date().toISOString().split('T')[0],
            return_date: passedBookingData?.returnDate || new Date().toISOString().split('T')[0],
            adults: bookingData.passengers,
            children: 0,
            room_type: passedBookingData?.roomType || "قياسية",
            departure_city: passedBookingData?.departureCity || "الرياض",
            total_price: bookingData.total,
            package_price: bookingData.basePrice * bookingData.passengers,
            savings: bookingData.savings * bookingData.passengers,
            wheelchair_service: bookingData.wheelchairService,
            extra_luggage: bookingData.luggageService,
            payment_method: paymentMethod,
            payment_status: 'pending',
            booking_status: 'pending',
            pre_booking_id: passedBookingData?.preBookingId || null,
            ...trackingData
          }
        ])
        .select('booking_reference');

      if (error) {
        console.error('Error saving booking:', error);
        throw error;
      }

      return data?.[0]?.booking_reference;
    } catch (error) {
      console.error('Error saving booking to database:', error);
      throw error;
    }
  };

  const handlePaymentProcess = async (customerData: { 
    name: string; 
    phone: string; 
    email: string; 
  }) => {
    try {
      // Always save booking to database first
      await saveBookingToDatabase(customerData);
      
      // Track the attempt
      trackConversion.paymentMethodSelected(paymentMethod, bookingData.total);
      
      // Show payment failed message
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "فشل في الدفع",
        description: "سيقوم فريقنا بالتواصل معكم قريباً لإتمام عملية الدفع.",
        duration: 10000,
      });
    } catch (error) {
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "خطأ في حفظ الحجز",
        description: "حدث خطأ أثناء حفظ معلومات الحجز. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const handlePayment = async () => {
    // Get form data
    const fullName = fullNameRef.current?.value.trim() || '';
    const phone = phoneRef.current?.value.trim() || '';
    const email = emailRef.current?.value.trim() || '';
    
    setIsProcessing(true);
    
    // Track payment method selection
    trackConversion.paymentMethodSelected(paymentMethod, bookingData.total);
    
    const customerData = { 
      name: fullName || `مستخدم مجهول`, 
      phone: phone || 'غير محدد', 
      email: email || 'غير محدد'
    };
    
    // For all payment methods, use the same process
    setTimeout(() => {
      handlePaymentProcess(customerData);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">إتمام الحجز</h1>
            <p className="text-lg text-muted-foreground">مراجعة وتأكيد طلب الحجز</p>
          </div>

        {/* Booking Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ملخص الحجز</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>الباقة:</span>
              <span className="font-medium">{bookingData.package}</span>
            </div>
            <div className="flex justify-between">
              <span>نوع الرحلة:</span>
              <span>{bookingData.tripType}</span>
            </div>
            <div className="flex justify-between">
              <span>عدد المسافرين:</span>
              <span>{bookingData.passengers} مسافر</span>
            </div>
            <div className="flex justify-between">
              <span>تاريخ الوصول:</span>
              <span>{bookingData.departureDate}</span>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>سعر الباقة (لكل مسافر):</span>
                <span>{bookingData.basePrice} ريال</span>
              </div>
              <div className="flex justify-between">
                <span>عدد المسافرين:</span>
                <span>{bookingData.passengers} مسافر</span>
              </div>
              <div className="flex justify-between">
                <span>إجمالي الباقة:</span>
                <span>{bookingData.basePrice * bookingData.passengers} ريال</span>
              </div>
              
              {/* Additional Services */}
              {bookingData.wheelchairService && (
                <div className="flex justify-between">
                  <span>خدمة دفع العربة للعمرة:</span>
                  <span>{bookingData.wheelchairPrice} ريال</span>
                </div>
              )}
              {bookingData.luggageService && (
                <div className="flex justify-between">
                  <span>نقل الأمتعة ({bookingData.passengers} مسافر):</span>
                  <span>{bookingData.luggagePrice} ريال</span>
                </div>
              )}
              
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>الإجمالي:</span>
                <span className="text-primary">{bookingData.total} ريال سعودي</span>
              </div>
            </div>
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
              <Input id="fullName" ref={fullNameRef} placeholder="أدخل الاسم الأول واسم العائلة" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف *</Label>
              <Input id="phone" ref={phoneRef} placeholder="+966 XX XXX XXXX" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني *</Label>
              <Input id="email" ref={emailRef} type="email" placeholder="example@email.com" required />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>طريقة الدفع</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 space-x-reverse p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <div className="flex items-center gap-3 flex-1">
                    {method.icon}
                    <div>
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
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
              رجوع
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري معالجة الدفع...
                </>
              ) : (
                <>
                  تأكيد الدفع - {bookingData.total} ريال
                  <ArrowRight className="w-4 h-4 mr-2" />
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