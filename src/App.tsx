
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
import VacanciesPage from '@/pages/VacanciesPage';
import UserTypeSelectionPage from './pages/UserTypeSelectionPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CertificateManagementPage from './pages/admin/CertificateManagementPage';
import ContentModerationPage from './pages/admin/ContentModerationPage';
import AllUsersPage from './pages/admin/AllUsersPage';
import AdminRouteGuard from './components/admin/AdminRouteGuard';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <TooltipProvider>
              <div className="min-h-screen bg-background">
                <Navbar />
                <main>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/teachers" element={<TeachersPage />} />
                    <Route path="/schools" element={<SchoolsPage />} />
                    <Route path="/teachers/:id" element={<TeacherProfilePage />} />
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
                    <Route path="/messages/:chatRoomId" element={<MessagesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/saved" element={<SavedItemsPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/privacy" element={<PrivacyPolicyPage />} />
                    <Route path="/terms" element={<TermsOfServicePage />} />
                    <Route path="/vacancies" element={<VacanciesPage />} />
                    <Route path="/user-type-selection" element={<UserTypeSelectionPage />} />
                    
                    {/* Admin Routes */}
                                <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={
              <AdminRouteGuard>
                <AdminDashboardPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/certificates" element={
              <AdminRouteGuard>
                <CertificateManagementPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/moderation" element={
              <AdminRouteGuard>
                <ContentModerationPage />
              </AdminRouteGuard>
            } />
            <Route path="/admin/users" element={
              <AdminRouteGuard>
                <AllUsersPage />
              </AdminRouteGuard>
            } />
                    
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster />
                <Sonner />
              </div>
            </TooltipProvider>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
