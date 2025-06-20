
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import HomePage from "./pages/HomePage";
import TeachersPage from "./pages/TeachersPage";
import SchoolsPage from "./pages/SchoolsPage";
import TeacherProfilePage from "./pages/TeacherProfilePage";
import SchoolProfilePage from "./pages/SchoolProfilePage";
import SchoolProfileDetailPage from "./pages/SchoolProfileDetailPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthPage from "./pages/AuthPage";
import SecureLoginPage from "./pages/SecureLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import PasswordResetPage from "./pages/PasswordResetPage";
import NotFoundPage from "./pages/NotFoundPage";
import TeacherDashboardPage from "./pages/dashboards/TeacherDashboardPage";
import SchoolDashboardPage from "./pages/dashboards/SchoolDashboardPage";
import MessagesPage from "./pages/MessagesPage";
import NotificationsPage from "./pages/NotificationsPage";
import SavedItemsPage from "./pages/SavedItemsPage";
import SupportPage from "./pages/SupportPage";
import FAQPage from "./pages/FAQPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LanguageProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/teachers" element={<TeachersPage />} />
                  <Route path="/schools" element={<SchoolsPage />} />
                  <Route path="/teacher/:id" element={<TeacherProfilePage />} />
                  <Route path="/schools/:id" element={<SchoolProfilePage />} />
                  <Route path="/school-profile/:id" element={<SchoolProfileDetailPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/secure-login" element={<SecureLoginPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<PasswordResetPage />} />
                  <Route path="/teacher-dashboard" element={<TeacherDashboardPage />} />
                  <Route path="/school-dashboard" element={<SchoolDashboardPage />} />
                  <Route path="/messages" element={<MessagesPage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/saved" element={<SavedItemsPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
