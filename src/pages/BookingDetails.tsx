import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarIcon, Users, Clock, MapPin, ArrowRight, Plus, Minus } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { getCustomerTrackingData } from "@/lib/customer-fingerprint";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { packageId } = useParams();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [arrivalTime, setArrivalTime] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [tripType, setTripType] = useState("roundtrip");
  const [wheelchairService, setWheelchairService] = useState(false);
  const [luggageService, setLuggageService] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [preBookingId, setPreBookingId] = useState<string | null>(null);

  const packageInfo = {
    "transport-only": {
      title: "الأساسية: نقل مرن",
      subtitle: "Basic Transportation Package", 
      originalPrice: 196,
      price: 98,
      banner: "تذكرة العودة للمطار مفتوحة لمدة أسبوعين من تاريخ الوصول، توجد رحلة كل 15 دقيقة"
    },
    "express-vip": {
      title: "الشاملة: نقل + راحة",
      subtitle: "Complete Package with Rest",
      originalPrice: 498,
      price: 249,
      banner: "تتوفر رحلات للعودة للمطار كل 15 دقيقة من الحرم مباشرة، ولا يتطلب الحجز على توقيت محدد"
    }
  };

  const timeSlots = [
    { value: "8-12", label: "8:00 ص - 12:00 م" },
    { value: "1-4", label: "1:00 م - 4:00 م" },
    { value: "5-9", label: "5:00 م - 9:00 م" }
  ];

  const currentPackage = packageInfo[packageId as keyof typeof packageInfo];

  // Silent pre-booking tracking when date and passengers are selected
  useEffect(() => {
    const savePreBooking = async () => {
      console.log('Pre-booking check:', {
        departureDate: !!departureDate,
        passengers,
        currentPackage: !!currentPackage,
        preBookingId,
        packageId
      });
      
      if (departureDate && passengers && currentPackage && !preBookingId) {
        try {
          console.log('Saving pre-booking...');
          const trackingData = getCustomerTrackingData();
          
          const { data, error } = await supabase
            .from('pre_bookings')
            .insert({
              package_id: packageId || '',
              package_name: currentPackage.title,
              departure_date: departureDate.toISOString().split('T')[0],
              adults: passengers,
              children: 0,
              wheelchair_service: wheelchairService,
              extra_luggage: luggageService,
              ...trackingData
            })
            .select('id')
            .single();
            
          if (error) {
            console.error('Pre-booking error:', error);
          } else if (data) {
            console.log('Pre-booking saved:', data.id);
            setPreBookingId(data.id);
          }
        } catch (error) {
          console.error('Pre-booking save failed:', error);
        }
      }
    };
    
    savePreBooking();
  }, [departureDate, passengers, wheelchairService, luggageService, packageId, currentPackage, preBookingId]);

  const handleDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setIsDatePickerOpen(false);
  };

  const handleContinue = () => {
    // Validation for required fields
    if (!departureDate) {
      alert("يرجى اختيار تاريخ الوصول");
      return;
    }
    
    // No need to validate return date for transport-only as it's open ticket
    
    const wheelchairPrice = wheelchairService ? 290 : 0;
    const luggagePrice = luggageService ? passengers * 15 : 0;
    const totalPrice = (currentPackage?.price || 0) + wheelchairPrice + luggagePrice;
    
    // Track begin checkout event
    trackConversion.beginCheckout(packageId || "", totalPrice);
    trackConversion.formSubmission("booking_details", "continue_to_checkout");
    
    const bookingData = {
      packageId,
      packageTitle: currentPackage?.title || "",
      tripType: packageId === "transport-only" ? "roundtrip" : "oneway",
      passengers,
      departureDate,
      returnDate,
      basePrice: currentPackage?.price || 0,
      wheelchairService,
      luggageService,
      wheelchairPrice,
      luggagePrice,
      totalPrice,
      preBookingId // Include pre-booking ID to link with final booking
    };
    
    navigate("/checkout", { state: { bookingData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4" dir="rtl">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-block bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-bold text-sm mb-4">
            خصم 50% - وفر {(currentPackage?.originalPrice || 0) - (currentPackage?.price || 0)} ريال
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">تفاصيل حجز باقة {currentPackage?.title}</h1>
          <p className="text-lg text-muted-foreground">اكمل بياناتك لإتمام الحجز</p>
        </div>

        <Card className="mb-6">
          <CardContent className="space-y-4 pt-6">
            {/* Number of Passengers */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                عدد المسافرين
              </Label>
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPassengers(Math.max(1, passengers - 1))}
                  disabled={passengers <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={passengers}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setPassengers(Math.max(1, Math.min(8, value)));
                  }}
                  className="w-20 text-center"
                  min="1"
                  max="8"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPassengers(Math.min(8, passengers + 1))}
                  disabled={passengers >= 8}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {passengers === 1 ? "مسافر" : "مسافرين"}
                </span>
              </div>
            </div>

            {/* Departure Date */}
            <div className="space-y-2">
              <Label>تاريخ الوصول</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate ? format(departureDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={departureDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Package Banner */}
            <div className="text-sm text-primary bg-primary/10 rounded-md p-3">
              {currentPackage?.banner}
            </div>

            {/* Additional Services for Express VIP Package */}
            {packageId === "express-vip" && (
              <div className="space-y-4 mt-6">
                <Label className="text-base font-semibold">الخدمات الإضافية</Label>
                
                {/* Wheelchair Service */}
                <div className="flex items-start space-x-3 space-x-reverse p-4 border rounded-lg">
                  <Checkbox 
                    id="wheelchair-service"
                    checked={wheelchairService}
                    onCheckedChange={(checked) => setWheelchairService(checked === true)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="wheelchair-service" className="font-medium text-base cursor-pointer">
                      خدمة دفع العربة للعمرة - 290 ريال
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      فريق متخصص يستقبلك من وصول الحافلة لأداء العمرة كاملة وإعادتك لنقطة الوصول
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Services for Basic Package */}
            {packageId === "transport-only" && (
              <div className="space-y-4 mt-6">
                <Label className="text-base font-semibold">الخدمات الإضافية</Label>
                
                {/* Wheelchair Service */}
                <div className="flex items-start space-x-3 space-x-reverse p-4 border rounded-lg">
                  <Checkbox 
                    id="wheelchair-service"
                    checked={wheelchairService}
                    onCheckedChange={(checked) => setWheelchairService(checked === true)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="wheelchair-service" className="font-medium text-base cursor-pointer">
                      خدمة دفع العربة للعمرة - 290 ريال
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      فريق متخصص يستقبلك من وصول الحافلة لأداء العمرة كاملة وإعادتك لنقطة الوصول
                    </p>
                  </div>
                </div>

                {/* Luggage Service */}
                <div className="flex items-start space-x-3 space-x-reverse p-4 border rounded-lg">
                  <Checkbox 
                    id="luggage-service"
                    checked={luggageService}
                    onCheckedChange={(checked) => setLuggageService(checked === true)}
                  />
                  <div className="flex-1">
                    <Label htmlFor="luggage-service" className="font-medium text-base cursor-pointer">
                      نقل الأمتعة - 15 ريال للشخص
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      فريق متخصص لحمل أمتعتك من المطار وإيصالها لجميع فنادق المنطقة المركزية المجاورة للحرم لتسمح لك بأداء عمرتك دون التوقف لإنزال الأمتعة
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ملخص الأسعار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>السعر الأصلي للباقة</span>
                <span className="line-through text-muted-foreground">{currentPackage?.originalPrice} ريال</span>
              </div>
              <div className="flex justify-between text-destructive font-semibold">
                <span>سعر الباقة مع الخصم 50%</span>
                <span>{currentPackage?.price} ريال</span>
              </div>
              {(packageId === "transport-only" || packageId === "express-vip") && wheelchairService && (
                <div className="flex justify-between">
                  <span>خدمة دفع العربة للعمرة</span>
                  <span>290 ريال</span>
                </div>
              )}
              {packageId === "transport-only" && luggageService && (
                <div className="flex justify-between">
                  <span>نقل الأمتعة ({passengers} مسافر)</span>
                  <span>{passengers * 15} ريال</span>
                </div>
              )}
              <div className="border-t pt-2 font-bold flex justify-between text-lg">
                <span>المجموع الكلي</span>
                <span>{(currentPackage?.price || 0) + (wheelchairService ? 290 : 0) + (luggageService ? passengers * 15 : 0)} ريال</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
            رجوع
          </Button>
          <Button onClick={handleContinue} className="flex-1">
            متابعة للدفع
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;