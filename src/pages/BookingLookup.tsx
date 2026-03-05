import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle, Calendar, Users, Phone, Mail, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  booking_reference: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  package_name: string;
  departure_date: string;
  return_date: string;
  adults: number;
  children: number;
  total_price: number;
  package_price: number;
  savings: number;
  wheelchair_service: boolean;
  extra_luggage: boolean;
  payment_method: string;
  payment_status: string;
  booking_status: string;
  room_type: string;
  departure_city: string;
  created_at: string;
}

const BookingLookup = () => {
  const [bookingReference, setBookingReference] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchBooking = async () => {
    if (!bookingReference.trim()) {
      toast({
        variant: "destructive",
        title: "رقم الحجز مطلوب",
        description: "يرجى إدخال رقم الحجز للبحث",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .rpc('get_booking_by_reference', { 
          booking_ref: bookingReference.trim() 
        });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        toast({
          variant: "destructive",
          title: "لم يتم العثور على الحجز",
          description: "رقم الحجز غير صحيح أو غير موجود",
        });
        setBooking(null);
      } else {
        setBooking(data[0]);
        toast({
          variant: "default",
          title: "تم العثور على الحجز",
          description: "تم عرض تفاصيل حجزك بنجاح",
        });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      toast({
        variant: "destructive",
        title: "خطأ في البحث",
        description: "حدث خطأ أثناء البحث عن الحجز. يرجى المحاولة مرة أخرى.",
      });
      setBooking(null);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">البحث عن الحجز</h1>
          <p className="text-lg text-muted-foreground">أدخل رقم الحجز للاطلاع على تفاصيل حجزك</p>
        </div>

        {/* Search Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              البحث عن الحجز
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bookingRef">رقم الحجز</Label>
              <Input
                id="bookingRef"
                value={bookingReference}
                onChange={(e) => setBookingReference(e.target.value)}
                placeholder="BK-XXXXXXXX"
                className="text-center font-mono"
              />
            </div>
            <Button 
              onClick={searchBooking}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  جاري البحث...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 ml-2" />
                  البحث عن الحجز
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Booking Details */}
        {booking && (
          <div className="space-y-6">
            {/* Booking Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    حالة الحجز
                  </span>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(booking.booking_status)}>
                      {booking.booking_status === 'confirmed' ? 'مؤكد' : 
                       booking.booking_status === 'pending' ? 'في الانتظار' : 'ملغي'}
                    </Badge>
                    <Badge variant={getPaymentStatusBadgeVariant(booking.payment_status)}>
                      {booking.payment_status === 'paid' ? 'مدفوع' : 
                       booking.payment_status === 'pending' ? 'في انتظار الدفع' : 'فشل الدفع'}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">رقم الحجز:</span>
                    <span className="font-mono">{booking.booking_reference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">تاريخ الحجز:</span>
                    <span>{formatDate(booking.created_at)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>معلومات العميل</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">الاسم:</span>
                    <span>{booking.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">رقم الهاتف:</span>
                    <span>{booking.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 md:col-span-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">البريد الإلكتروني:</span>
                    <span>{booking.customer_email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Booking Details */}
            <Card>
              <CardHeader>
                <CardTitle>تفاصيل الحجز</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span>الباقة:</span>
                    <span className="font-medium">{booking.package_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>مدينة المغادرة:</span>
                    <span>{booking.departure_city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ المغادرة:</span>
                    <span>{formatDate(booking.departure_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تاريخ العودة:</span>
                    <span>{formatDate(booking.return_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>عدد البالغين:</span>
                    <span>{booking.adults} مسافر</span>
                  </div>
                  <div className="flex justify-between">
                    <span>نوع الغرفة:</span>
                    <span>{booking.room_type}</span>
                  </div>
                </div>

                <Separator />

                {/* Additional Services */}
                <div className="space-y-2">
                  <h4 className="font-medium">الخدمات الإضافية:</h4>
                  <div className="flex gap-4">
                    {booking.wheelchair_service && (
                      <Badge variant="outline">خدمة دفع العربة للعمرة</Badge>
                    )}
                    {booking.extra_luggage && (
                      <Badge variant="outline">نقل الأمتعة الإضافية</Badge>
                    )}
                    {!booking.wheelchair_service && !booking.extra_luggage && (
                      <span className="text-muted-foreground">لا توجد خدمات إضافية</span>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>سعر الباقة:</span>
                    <span>{booking.package_price} ريال</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>المبلغ المُوفر:</span>
                    <span>{booking.savings} ريال</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>الإجمالي:</span>
                    <span className="text-primary">{booking.total_price} ريال سعودي</span>
                  </div>
                </div>

                <Separator />

                {/* Payment Information */}
                <div className="flex justify-between">
                  <span>طريقة الدفع:</span>
                  <span className="font-medium">{booking.payment_method}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLookup;