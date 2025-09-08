import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, PlusCircle, LogOut, CheckCircle, Clock, XCircle, Shield, BarChart3, ChevronDown, Building, Info, FileText } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsLegalOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Verification badge component
  const VerificationBadge = () => {
    if (!user) return null;
    
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
          <CheckCircle className="h-3 w-3 mr-1" />
          Verified
        </span>
      );
    }
    
    if (user.hasPendingVerification) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    }
    
    if (user.role === 'landlord' || user.role === 'admin') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 ml-2">
          <XCircle className="h-3 w-3 mr-1" />
          Not Verified
        </span>
      );
    }
    
    return null;
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800">NyumbaPaeasy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                location.pathname.startsWith('/properties') 
                  ? 'bg-emerald-50 text-emerald-600' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Building className="h-4 w-4 mr-1" />
              Properties
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                  isResourcesOpen 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="h-4 w-4 mr-1" />
                Resources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
                  <Link 
                    to="/about" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/faq" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    FAQ
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsResourcesOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
              )}
            </div>
            
            {/* Legal Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsLegalOpen(!isLegalOpen)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-colors ${
                  isLegalOpen 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="h-4 w-4 mr-1" />
                Legal
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isLegalOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLegalOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200">
                  <Link 
                    to="/terms" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Privacy Policy
                  </Link>
                  <Link 
                    to="/cookies" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Cookie Policy
                  </Link>
                  <Link 
                    to="/use-policy" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg mx-2"
                    onClick={() => setIsLegalOpen(false)}
                  >
                    Use Policy
                  </Link>
                </div>
              )}
            </div>
            
            {isAuthenticated && user?.role === 'landlord' && (
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  location.pathname === '/dashboard' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Shield className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}
            {isAuthenticated && (user?.role === 'landlord' || user?.role === 'admin') && (
              <Link 
                to="/profile" 
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                  location.pathname === '/profile' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
               <User className="h-4 w-4 mr-1" />
               My Profile
              </Link>
            )}
            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    location.pathname === '/admin/dashboard' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  Admin
                </Link>
                <Link 
                  to="/analytics" 
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center ${
                    location.pathname === '/analytics' 
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Analytics
                </Link>
              </>
            )}
          </nav>
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {(user?.role === 'landlord' || user?.role === 'admin') && (
                  <Link to="/add-property" className="btn btn-primary flex items-center space-x-1 text-sm py-2 px-3">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Property</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden">
                    <User className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <VerificationBadge />
                    </div>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-1 py-2 px-3 rounded-lg hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn btn-outline text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`text-base font-medium p-3 rounded-lg ${
                  location.pathname === '/' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className={`text-base font-medium p-3 rounded-lg flex items-center ${
                  location.pathname.startsWith('/properties') ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building className="h-5 w-5 mr-2" />
                Properties
              </Link>
              
              {/* Mobile Resources */}
              <div>
                <button 
                  onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                  className="w-full text-left text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="flex items-center">
                    <Info className="h-5 w-5 mr-2" />
                    Resources
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {isResourcesOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    <Link 
                      to="/about" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      About Us
                    </Link>
                    <Link 
                      to="/faq" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      FAQ
                    </Link>
                    <Link 
                      to="/contact" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Contact
                    </Link>
                  </div>
                )}
              </div>
              
              {/* Mobile Legal */}
              <div>
                <button 
                  onClick={() => setIsLegalOpen(!isLegalOpen)}
                  className="w-full text-left text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100 flex justify-between items-center"
                >
                  <span className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Legal
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isLegalOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLegalOpen && (
                  <div className="pl-4 space-y-1 mt-1">
                    <Link 
                      to="/terms" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Terms & Conditions
                    </Link>
                    <Link 
                      to="/privacy" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Privacy Policy
                    </Link>
                    <Link 
                      to="/cookies" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Cookie Policy
                    </Link>
                    <Link 
                      to="/use-policy" 
                      className="block text-base font-medium p-3 rounded-lg text-gray-700 hover:bg-gray-100"
                    >
                      Use Policy
                    </Link>
                  </div>
                )}
              </div>
              
              {isAuthenticated && (user?.role === 'landlord' || user?.role === 'admin') && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-base font-medium p-3 rounded-lg flex items-center ${
                      location.pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/add-property" 
                    className="text-base font-medium p-3 rounded-lg bg-emerald-100 text-emerald-700 flex items-center"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Property
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`text-base font-medium p-3 rounded-lg flex items-center ${
                      location.pathname === '/profile' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    <div className="flex items-center">
                      <span>My Profile</span>
                      <VerificationBadge />
                    </div>
                  </Link>
                </>
              )}
              
              {isAuthenticated && user?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin/dashboard" 
                    className={`text-base font-medium p-3 rounded-lg flex items-center ${
                      location.pathname === '/admin/dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-5 w-5 mr-2" />
                    Admin Dashboard
                  </Link>
                  <Link 
                    to="/analytics" 
                    className={`text-base font-medium p-3 rounded-lg flex items-center ${
                      location.pathname === '/analytics' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Analytics
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-base font-medium p-3 rounded-lg text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Logout
                </button>
              ) : (
                <div className="flex flex-col space-y-3 pt-3 border-t border-gray-100">
                  <Link to="/login" className="btn btn-outline text-center py-3">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary text-center py-3">
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;