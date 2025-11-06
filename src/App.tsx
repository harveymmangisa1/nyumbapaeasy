import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/Home';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ProfilePage from './pages/ProfilePage';
import { PropertyProvider } from './context/PropertyContext';
import EditPropertyPage from './pages/EditPropertyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import UsePolicyPage from './pages/UsePolicyPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AgencyDashboardPage from './pages/AgencyDashboardPage';
import WelcomePage from './pages/WelcomePage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import { AuthProvider } from './context/AuthContext';

import AnalyticsPage from './pages/AnalyticsPage';
// Policy pages
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePage from './pages/CookiePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import PostAuthRedirect from './pages/PostAuthRedirect';
import ProtectedRoute from './components/routing/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';

function App() {
  return (
    <Router>
      <AuthProvider>
          <PropertyProvider> 
              <div className="flex flex-col min-h-screen bg-background with-fixed-header">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties" element={<PropertyListingPage />} />
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route path="/auth/callback" element={<AuthCallbackPage />} />
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/use-policy" element={<UsePolicyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/cookies" element={<CookiePage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    <Route path="/post-auth" element={<PostAuthRedirect />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Authenticated routes (any logged-in user) */}
                    <Route element={<ProtectedRoute requireAuth={true} />}> 
                      <Route path="/profile" element={<ProfilePage />} />
                    </Route>

                    {/* Landlord/Admin routes */}
                    <Route element={<ProtectedRoute requireAuth={true} allowedRoles={[ 'landlord', 'admin' ]} />}> 
                      <Route path="/dashboard" element={<DashboardPage />} />
                      <Route path="/add-property" element={<AddPropertyPage />} />
                      <Route path="/edit-property/:id" element={<EditPropertyPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                    </Route>

                    {/* Real Estate Agency routes */}
                    <Route element={<ProtectedRoute requireAuth={true} allowedRoles={[ 'real_estate_agency' ]} />}> 
                      <Route path="/agency/dashboard" element={<AgencyDashboardPage />} />
                    </Route>

                    {/* Admin-only routes */}
                    <Route element={<ProtectedRoute requireAuth={true} allowedRoles={[ 'admin' ]} />}> 
                      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                      <Route path="/admin/verification" element={<AdminVerificationPage />} />
                    </Route>
                  </Routes>
                </main>
                <Footer />
              </div>
            </PropertyProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;
