
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import HomePage from "./pages/HomePage";
import TeachersPage from "./pages/TeachersPage";
import SchoolsPage from "./pages/SchoolsPage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import SchoolProfilePage from "./pages/SchoolProfilePage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import NotFoundPage from "./pages/NotFoundPage";

// Dashboard prototypes (placeholder pages)
import TeacherDashboardPage from "./pages/dashboards/TeacherDashboardPage";
import SchoolDashboardPage from "./pages/dashboards/SchoolDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/teachers" element={<TeachersPage />} />
                <Route path="/teachers/:id" element={<TeacherProfilePage />} />
                <Route path="/schools" element={<SchoolsPage />} />
                <Route path="/schools/:id" element={<SchoolProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/support" element={<SupportPage />} />
                <Route path="/privacy" element={<PrivacyPolicyPage />} />
                <Route path="/terms" element={<TermsOfServicePage />} />
                
                {/* Dashboard routes */}
                <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
                <Route path="/school-dashboard" element={<SchoolDashboardPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
