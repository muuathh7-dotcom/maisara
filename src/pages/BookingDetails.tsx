import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Users, ArrowRight, ArrowLeft, Plus, Minus, Plane, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { trackConversion } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { getCustomerTrackingData } from "@/lib/customer-fingerprint";
import BookingProgress from "@/components/BookingProgress";
import { getServicesByIds, type ServiceConfig } from "@/lib/services-config";

const BookingDetails = () => {
  const navigate = useNavigate();
  const { serviceIds } = useParams();
  const [departureDate, setDepartureDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [preBookingId, setPreBookingId] = useState<string | null>(null);
  const [airlineName, setAirlineName] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  const [hotelTiming, setHotelTiming] = useState<"before" | "after" | "">("");

  // Parse services from URL
  const selectedServices: ServiceConfig[] = serviceIds
    ? getServicesByIds(serviceIds.split(","))
    : [];

  const hasHourlyHotel = selectedServices.some((s) => s.id === "hourly-hotel");


  // Redirect if no valid services
  useEffect(() => {
    if (selectedServices.length === 0) {
      navigate("/");
    }
  }, [selectedServices.length, navigate]);

  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0) * passengers;

  // Silent pre-booking tracking
  useEffect(() => {
    const savePreBooking = async () => {
      if (departureDate && passengers && selectedServices.length > 0 && !preBookingId) {
        try {
          const trackingData = getCustomerTrackingData();
          const serviceIdList = selectedServices.map((s) => s.id).join(",");
          const serviceNames = selectedServices.map((s) => s.title).join(" + ");

          const { data, error } = await supabase
            .from("pre_bookings")
            .insert({
              package_id: serviceIdList,
              package_name: serviceNames,
              departure_date: departureDate.toISOString().split("T")[0],
              adults: passengers,
              children: 0,
              wheelchair_service: false,
              extra_luggage: false,
              ...trackingData,
            })
            .select("id")
            .single();

          if (error) {
            console.error("Pre-booking error:", error);
          } else if (data) {
            setPreBookingId(data.id);
          }
        } catch (error) {
          console.error("Pre-booking save failed:", error);
        }
      }
    };

    savePreBooking();
  }, [departureDate, passengers, selectedServices.length, preBookingId]);

  const handleDateSelect = (date: Date | undefined) => {
    setDepartureDate(date);
    setIsDatePickerOpen(false);
  };

  const handleContinue = () => {
    if (!departureDate) {
      alert("يرجى اختيار تاريخ الوصول");
      return;
    }

    trackConversion.beginCheckout(serviceIds || "", totalPrice);
    trackConversion.formSubmission("booking_details", "continue_to_checkout");

    const bookingData = {
      services: selectedServices.map((s) => ({
        id: s.id,
        title: s.title,
        price: s.price,
        priceLabel: s.priceLabel,
      })),
      passengers,
      departureDate,
      totalPrice,
      preBookingId,
      airlineName,
      flightNumber,
      arrivalTime,
      hotelTiming: hasHourlyHotel ? hotelTiming : undefined,
    };

    navigate("/checkout", { state: { bookingData } });
  };

  if (selectedServices.length === 0) return null;

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4"
      dir="rtl"
    >
      <div className="max-w-2xl mx-auto py-8">
        {/* Progress */}
        <BookingProgress currentStep={3} />

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">تفاصيل الحجز</h1>
          <p className="text-lg text-muted-foreground">
            أكمل بياناتك لإتمام الحجز
          </p>
        </div>

        {/* Selected services summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>الخدمات المختارة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${service.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm">{service.title}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {service.priceLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Trip details form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>تفاصيل الرحلة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate
                      ? format(departureDate, "PPP", { locale: ar })
                      : "اختر التاريخ"}
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
          </CardContent>
        </Card>

        {/* Flight & Arrival Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plane className="w-5 h-5" />
              معلومات الرحلة والوصول
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Airline */}
              <div className="space-y-2">
                <Label htmlFor="airlineName">شركة الطيران</Label>
                <Input
                  id="airlineName"
                  value={airlineName}
                  onChange={(e) => setAirlineName(e.target.value)}
                  placeholder="مثال: الخطوط السعودية"
                />
              </div>

              {/* Flight Number */}
              <div className="space-y-2">
                <Label htmlFor="flightNumber">رقم الرحلة</Label>
                <Input
                  id="flightNumber"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  placeholder="مثال: SV 123"
                  className="text-left"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Arrival Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                وقت الوصول المتوقع إلى مطار جدة
              </Label>
              <div className="grid grid-cols-2 gap-3" dir="ltr">
                <Select
                  value={arrivalTime.slice(0, 2)}
                  onValueChange={(h) => setArrivalTime(h + (arrivalTime.slice(2) || "00"))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الساعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((h) => (
                      <SelectItem key={h} value={h}>{h}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={arrivalTime.slice(2, 4)}
                  onValueChange={(m) => setArrivalTime((arrivalTime.slice(0, 2) || "00") + m)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الدقيقة" />
                  </SelectTrigger>
                  <SelectContent>
                    {["00", "15", "30", "45"].map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hotel timing — shown directly when hourly-hotel is selected */}
            {hasHourlyHotel && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg space-y-3">
                <p className="text-sm font-medium text-rose-800">
                  هل تريد الغرفة الفندقية قبل العمرة أم بعدها؟
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setHotelTiming("before")}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                      hotelTiming === "before"
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-rose-200 bg-white text-rose-700 hover:border-rose-400"
                    )}
                  >
                    قبل العمرة
                  </button>
                  <button
                    type="button"
                    onClick={() => setHotelTiming("after")}
                    className={cn(
                      "flex-1 py-2 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                      hotelTiming === "after"
                        ? "border-rose-600 bg-rose-600 text-white"
                        : "border-rose-200 bg-white text-rose-700 hover:border-rose-400"
                    )}
                  >
                    بعد العمرة
                  </button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              هذه المعلومات تساعدنا في تنسيق استقبالك في المطار وتجهيز الخدمات في الوقت المناسب
            </p>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ملخص الأسعار</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between text-sm">
                  <span>{service.title}</span>
                  <span className="text-muted-foreground">
                    {service.priceLabel}
                  </span>
                </div>
              ))}

              {passengers > 1 && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>× {passengers} مسافرين</span>
                  <span></span>
                </div>
              )}

              <div className="border-t pt-2 font-bold flex justify-between text-lg">
                <span>المجموع الكلي</span>
                <span className="text-primary">من {totalPrice} ر.س</span>
              </div>

              <p className="text-xs text-muted-foreground mt-2">
                * الأسعار تبدأ من المبالغ المذكورة وقد تختلف حسب التفاصيل
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="flex-1"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            رجوع
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 primary-gradient text-primary-foreground font-bold"
          >
            متابعة للدفع
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
