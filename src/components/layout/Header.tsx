import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, PlusCircle, LogOut, CheckCircle, Clock, XCircle, Building, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close menus when changing routes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Verification badge component
  const VerificationBadge = () => {
    if (!user) return null;
    
    if (user.profile.is_verified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="-ml-0.5 mr-1.5 h-4 w-4" />
          Verified
        </span>
      );
    }
    
    if (user.profile.has_pending_verification) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="-ml-0.5 mr-1.5 h-4 w-4" />
          Pending
        </span>
      );
    }
    
    if (user.profile.role === 'landlord' || user.profile.role === 'admin') {
      return (
        <Link to="/verify" className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200">
          <XCircle className="-ml-0.5 mr-1.5 h-4 w-4" />
          Not Verified
        </Link>
      );
    }
    
    return null;
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100' 
        : 'bg-white/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="flex items-center justify-center w-8 h-8 bg-gray-900 rounded-lg group-hover:bg-gray-800 transition-colors">
              <Home className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">NyumbaPaeasy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                location.pathname.startsWith('/properties') 
                  ? 'text-gray-900 bg-gray-100' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Building className="h-4 w-4 mr-2" />
              Properties
            </Link>
            
            {/* Resources Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-all duration-200 ${
                  isResourcesOpen 
                    ? 'text-gray-900 bg-gray-100' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Resources
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  isResourcesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              
              {isResourcesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  <Link 
                    to="/about" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/faq" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Contact
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link 
                    to="/terms" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </nav>
          
          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                  <Link 
                    to="/add-property" 
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>List Property</span>
                  </Link>
                )}
                
                <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        <VerificationBadge />
                      </div>
                      <span className="text-xs text-gray-500 capitalize">{user.profile.role}</span>
                    </div>
                  </div>
                  
                  {/* User dropdown menu */}
                  <div className="relative">
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        My Profile
                      </Link>
                      {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                        <Link 
                          to="/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                      {user.profile.role === 'admin' && (
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          Admin
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-3 space-y-1">
            <Link 
              to="/" 
              className="block px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className="block px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
            >
              <Building className="h-4 w-4 mr-3" />
              Properties
            </Link>
            
            {/* Mobile Resources */}
            <div>
              <button 
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Resources
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                  isResourcesOpen ? 'rotate-180' : ''
                }`} />
              </button>
              {isResourcesOpen && (
                <div className="pl-6 space-y-1 mt-1">
                  <Link 
                    to="/about" 
                    className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/faq" 
                    className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    FAQ
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/terms" 
                    className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Terms & Conditions
                  </Link>
                  <Link 
                    to="/privacy" 
                    className="block px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
            
            {user && (
              <>
                <div className="border-t border-gray-100 my-2 pt-2">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </div>
                  <Link 
                    to="/profile" 
                    className="block px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                  >
                    <User className="h-4 w-4 mr-3" />
                    <span>My Profile</span>
                    <VerificationBadge />
                  </Link>
                  {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                    <Link 
                      to="/dashboard" 
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.profile.role === 'admin' && (
                    <Link 
                      to="/admin/dashboard" 
                      className="block px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                </div>
                
                {(user.profile.role === 'landlord' || user.profile.role === 'admin') && (
                  <Link 
                    to="/add-property" 
                    className="block px-3 py-2 text-base font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                  >
                    <PlusCircle className="h-4 w-4 mr-3" />
                    List Property
                  </Link>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Logout
                </button>
              </>
            )}
            
            {!user && (
              <div className="border-t border-gray-100 pt-4 space-y-2">
                <Link 
                  to="/login" 
                  className="block w-full text-center px-3 py-2 text-base font-medium text-gray-900 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block w-full text-center px-3 py-2 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;