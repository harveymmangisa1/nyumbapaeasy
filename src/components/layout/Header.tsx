import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, PlusCircle, LogOut, CheckCircle, Clock, Building, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const VerificationBadge = () => {
    if (!user) return null;

    if (user.profile.is_verified) {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="-ml-0.5 mr-1 h-3 w-3" />
          Verified
        </span>
      );
    }

    if (user.profile.has_pending_verification) {
      return (
        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="-ml-0.5 mr-1 h-3 w-3" />
          Pending
        </span>
      );
    }

    return null; // Simplified: verification CTA can be in the profile page
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-shadow duration-300 ${
        isScrolled ? 'shadow-md bg-surface/90 backdrop-blur-sm' : 'bg-surface/80'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">NyumbaPaeasy</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
              Home
            </Link>
            <Link to="/properties" className={`nav-link ${location.pathname.startsWith('/properties') ? 'active' : ''}`}>
              <Building className="h-4 w-4 mr-1.5" />
              Properties
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                aria-expanded={isResourcesOpen}
                aria-controls="resources-menu"
                className={`nav-link ${isResourcesOpen ? 'active' : ''}`}>
                Resources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isResourcesOpen && (
                <div id="resources-menu" className="absolute top-full left-0 mt-2 w-56 bg-surface rounded-md shadow-lg border border-border py-1 z-50">
                  <Link to="/about" className="dropdown-link">About Us</Link>
                  <Link to="/faq" className="dropdown-link">FAQ</Link>
                  <Link to="/contact" className="dropdown-link">Contact</Link>
                  <div className="border-t border-border my-1"></div>
                  <Link to="/terms" className="dropdown-link">Terms & Conditions</Link>
                  <Link to="/privacy" className="dropdown-link">Privacy Policy</Link>
                </div>
              )}
            </div>
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                  <Link to="/add-property" className="btn btn-primary text-sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    List Property
                  </Link>
                )}
                <div className="relative group">
                  <div className="flex items-center space-x-2 cursor-pointer p-2 rounded-md hover:bg-gray-100">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-text-secondary" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-text-primary">{user.name}</span>
                      <span className="text-xs text-text-secondary capitalize">{user.profile.role}</span>
                    </div>
                    <VerificationBadge />
                    <ChevronDown className="h-4 w-4 text-text-secondary" />
                  </div>
                  {/* User dropdown menu */}
                  <div className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-border py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/profile" className="dropdown-link">My Profile</Link>
                    {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                      <Link to="/dashboard" className="dropdown-link">Dashboard</Link>
                    )}
                    {user.profile.role === 'admin' && (
                      <Link to="/admin/dashboard" className="dropdown-link">Admin Panel</Link>
                    )}
                    <div className="border-t border-border my-1"></div>
                    <button onClick={handleLogout} className="w-full text-left dropdown-link text-red-600 hover:bg-red-50">
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors">Login</Link>
                <Link to="/register" className="btn btn-secondary text-sm">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-md text-text-secondary hover:bg-gray-100" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="mobile-menu">
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="lg:hidden bg-surface border-t border-border animate-in slide-in-from-top-full duration-300">
          <div className="px-2 py-4 space-y-2">
            <Link to="/" className="mobile-nav-link">Home</Link>
            <Link to="/properties" className="mobile-nav-link"><Building className="h-4 w-4 mr-3" />Properties</Link>
            {/* Add other mobile links here */}
            <div className="border-t border-border pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <div className="px-3 mb-2">
                    <p className="font-semibold text-text-primary">{user.name}</p>
                    <p className="text-sm text-text-secondary capitalize">{user.profile.role}</p>
                    <VerificationBadge />
                  </div>
                  <Link to="/profile" className="mobile-nav-link"><User className="h-4 w-4 mr-3" />My Profile</Link>
                  {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                    <Link to="/add-property" className="mobile-nav-link bg-gray-50"><PlusCircle className="h-4 w-4 mr-3" />List Property</Link>
                  )}
                  <button onClick={handleLogout} className="mobile-nav-link text-red-600"><LogOut className="h-4 w-4 mr-3" />Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline w-full">Login</Link>
                  <Link to="/register" className="btn btn-secondary w-full">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// Add these utility classes to your main CSS file (e.g., index.css) under @layer components
/*
.nav-link {
  @apply px-3 py-2 rounded-md text-sm font-medium text-text-secondary hover:bg-gray-100 hover:text-primary transition-colors flex items-center;
}
.nav-link.active {
  @apply bg-gray-100 text-primary;
}
.dropdown-link {
  @apply block px-4 py-2 text-sm text-text-secondary hover:bg-gray-100 hover:text-primary transition-colors;
}
.mobile-nav-link {
  @apply block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-gray-100 transition-colors flex items-center;
}
*/

export default Header;
