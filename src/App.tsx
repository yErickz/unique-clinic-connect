import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import InstitutesPage from "./pages/InstitutesPage";
import InstitutePage from "./pages/InstitutePage";
import DoctorsPage from "./pages/DoctorsPage";
import DoctorProfile from "./pages/DoctorProfile";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDoctors from "./pages/admin/AdminDoctors";
import AdminInstitutes from "./pages/admin/AdminInstitutes";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContent from "./pages/admin/AdminContent";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminConvenios from "./pages/admin/AdminConvenios";

const queryClient = new QueryClient();

const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Header />
    {children}
    <Footer />
    <WhatsAppButton />
    <CookieBanner />
  </>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><Index /></PublicLayout>} />
            <Route path="/institutos" element={<PublicLayout><InstitutesPage /></PublicLayout>} />
            <Route path="/instituto/:id" element={<PublicLayout><InstitutePage /></PublicLayout>} />
            <Route path="/medicos" element={<PublicLayout><DoctorsPage /></PublicLayout>} />
            <Route path="/medico/:id" element={<PublicLayout><DoctorProfile /></PublicLayout>} />
            <Route path="/contato" element={<PublicLayout><Contact /></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="medicos" element={<AdminDoctors />} />
              <Route path="institutos" element={<AdminInstitutes />} />
              <Route path="depoimentos" element={<AdminTestimonials />} />
              <Route path="galeria" element={<AdminGallery />} />
              <Route path="convenios" element={<AdminConvenios />} />
              <Route path="conteudo" element={<AdminContent />} />
            </Route>

            <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
