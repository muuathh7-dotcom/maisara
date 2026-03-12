import {
  Car,
  Bus,
  ParkingCircle,
  Scissors,
  Package,
  Hotel,
  Dumbbell,
} from "lucide-react";

export interface ServiceConfig {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  priceUnit?: string;
  icon: React.ElementType;
  accentColor: string;
  iconBg: string;
  borderColor: string;
  checkColor: string;
  category: "transport" | "addon";
}

export const SERVICES: ServiceConfig[] = [
  {
    id: "private-transfer",
    title: "نقل خاص من وإلى المطار",
    description: "سيارة خاصة مع سائق محترف توصلك بأمان وراحة تامة",
    price: 150,
    priceLabel: "من 150 ر.س",
    icon: Car,
    accentColor: "from-emerald-600 to-emerald-800",
    iconBg: "bg-emerald-50 text-emerald-700",
    borderColor: "border-emerald-200 hover:border-emerald-400",
    checkColor: "bg-emerald-600",
    category: "transport",
  },
  {
    id: "bus-transfer",
    title: "نقل بالحافلة من وإلى المطار",
    description: "حافلات مكيّفة ومريحة بمواعيد منتظمة كل 15 دقيقة",
    price: 35,
    priceLabel: "من 35 ر.س",
    icon: Bus,
    accentColor: "from-teal-600 to-teal-800",
    iconBg: "bg-teal-50 text-teal-700",
    borderColor: "border-teal-200 hover:border-teal-400",
    checkColor: "bg-teal-600",
    category: "transport",
  },
  {
    id: "parking",
    title: "حجز مواقف المسار",
    description: "مواقف آمنة بالقرب من الحرم الشريف لراحتك",
    price: 40,
    priceLabel: "من 40 ر.س",
    icon: ParkingCircle,
    accentColor: "from-blue-600 to-blue-800",
    iconBg: "bg-blue-50 text-blue-700",
    borderColor: "border-blue-200 hover:border-blue-400",
    checkColor: "bg-blue-600",
    category: "addon",
  },
  {
    id: "tahallul",
    title: "خدمات التحلل والقص",
    description: "خدمة حلاقة وتقصير بعد أداء مناسك العمرة",
    price: 20,
    priceLabel: "من 20 ر.س",
    icon: Scissors,
    accentColor: "from-violet-600 to-violet-800",
    iconBg: "bg-violet-50 text-violet-700",
    borderColor: "border-violet-200 hover:border-violet-400",
    checkColor: "bg-violet-600",
    category: "addon",
  },
  {
    id: "storage",
    title: "كبائن التخزين",
    description: "كبائن آمنة لحفظ أمتعتك طوال فترة العمرة",
    price: 25,
    priceLabel: "من 25 ر.س",
    icon: Package,
    accentColor: "from-amber-600 to-amber-800",
    iconBg: "bg-amber-50 text-amber-700",
    borderColor: "border-amber-200 hover:border-amber-400",
    checkColor: "bg-amber-600",
    category: "addon",
  },
  {
    id: "hourly-hotel",
    title: "فنادق بالساعة",
    description: "غرف فندقية مريحة للاستراحة بالساعة قبل العمرة أو بعدها",
    price: 75,
    priceLabel: "من 75 ر.س/ساعة",
    priceUnit: "ساعة",
    icon: Hotel,
    accentColor: "from-rose-600 to-rose-800",
    iconBg: "bg-rose-50 text-rose-700",
    borderColor: "border-rose-200 hover:border-rose-400",
    checkColor: "bg-rose-600",
    category: "addon",
  },
  {
    id: "hotel-facilities",
    title: "مرافق فندقية بدون إقامة",
    description: "استفد من مرافق الفندق دون الحاجة لحجز غرفة",
    price: 50,
    priceLabel: "من 50 ر.س",
    icon: Dumbbell,
    accentColor: "from-cyan-600 to-cyan-800",
    iconBg: "bg-cyan-50 text-cyan-700",
    borderColor: "border-cyan-200 hover:border-cyan-400",
    checkColor: "bg-cyan-600",
    category: "addon",
  },
];

export const EXCLUSION_RULES = [
  {
    whenSelected: "private-transfer",
    disables: ["bus-transfer", "parking"],
    reason: "غير متاح مع خدمة النقل الخاص",
  },
  {
    whenSelected: "bus-transfer",
    disables: ["private-transfer"],
    reason: "غير متاح مع خدمة النقل بالحافلة",
  },
];

export const TRANSPORT_SERVICES = SERVICES.filter(s => s.category === "transport");
export const ADDON_SERVICES = SERVICES.filter(s => s.category === "addon");

export const getServiceById = (id: string): ServiceConfig | undefined =>
  SERVICES.find(s => s.id === id);

export const getServicesByIds = (ids: string[]): ServiceConfig[] =>
  ids.map(id => getServiceById(id)).filter((s): s is ServiceConfig => !!s);
