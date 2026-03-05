import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import PackageSelection from "./pages/PackageSelection";
import BookingDetails from "./pages/BookingDetails";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import { trackPageView } from "./lib/analytics";

const queryClient = new QueryClient();

// Component to track page views
const PageTracker = () => {
  const location = useLocation();
  
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/packages" element={<PackageSelection />} />
          <Route path="/booking-details/:packageId" element={<BookingDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
