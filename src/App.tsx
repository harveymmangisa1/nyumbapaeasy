import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import PropertyListingPage from './pages/PropertyListingPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AddPropertyPage from './pages/AddPropertyPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './context/UserContext'; // UserProvider now uses Firebase
import { PropertyProvider } from './context/PropertyContext';
import EditPropertyPage from './pages/EditPropertyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import UsePolicyPage from './pages/UsePolicyPage';


function App() {
  return (
    <Router>
      <UserProvider> {/* Correctly placed */}
        <PropertyProvider> {/* Correctly placed */}
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Header /> {/* Can access user context */}
            <main className="flex-grow">
              <Routes> {/* Components rendered here can access user context */}
                <Route path="/" element={<HomePage />} />
                <Route path="/properties" element={<PropertyListingPage />} />
                <Route path="/properties/:id" element={<PropertyDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<DashboardPage />} /> {/* Protected route logic inside component */}
                <Route path="/add-property" element={<AddPropertyPage />} /> {/* Protected route logic inside component */}
                <Route path="/edit-property/:id" element={<EditPropertyPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/use-policy" element={<UsePolicyPage />} />
              </Routes>
            </main>
            <Footer /> {/* Can access user context */}
          </div>
        </PropertyProvider>
      </UserProvider>
    </Router>
  );
}

export default App;
