import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ProfilePage from './pages/ProfilePage';
import { PropertyProvider } from './context/PropertyContext';
import EditPropertyPage from './pages/EditPropertyPage'; // Fixed extension
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import UsePolicyPage from './pages/UsePolicyPage';
import AdminVerificationPage from './pages/AdminVerificationPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AgencyDashboardPage from './pages/AgencyDashboardPage';
import WelcomePage from './pages/WelcomePage';
import { AuthProvider } from './context/AuthContext';

import AnalyticsPage from './pages/AnalyticsPage';
// Policy pages
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiePage from './pages/CookiePage';

function App() {
  return (
    <Router>
      <AuthProvider>
          <PropertyProvider> {/* Correctly placed */}
              <div className="flex flex-col min-h-screen bg-background">
                <Header /> {/* Can access user context */}
                <main className="flex-grow">
                  <Routes> {/* Components rendered here can access user context */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/properties" element={<PropertyListingPage />} />
                    <Route path="/properties/:id" element={<PropertyDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/welcome" element={<WelcomePage />} />

                    <Route path="/dashboard" element={<DashboardPage />} /> {/* Protected route logic inside component */}
                    <Route path="/agency/dashboard" element={<AgencyDashboardPage />} /> {/* Agency dashboard */}
                    <Route path="/add-property" element={<AddPropertyPage />} /> {/* Protected route logic inside component */}
                    <Route path="/edit-property/:id" element={<EditPropertyPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                    <Route path="/admin/verification" element={<AdminVerificationPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/use-policy" element={<UsePolicyPage />} />
                    {/* Policy pages */}
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/cookies" element={<CookiePage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  </Routes>
                </main>
                <Footer /> {/* Can access user context */}
              </div>
            </PropertyProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;