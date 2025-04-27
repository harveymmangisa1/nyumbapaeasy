import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, PlusCircle, LogOut, Search } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
  }, [location]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-gray-800">NyumbaPaeasy</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium hover:text-emerald-600 transition-colors ${
                location.pathname === '/' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/properties" 
              className={`text-sm font-medium hover:text-emerald-600 transition-colors ${
                location.pathname === '/properties' ? 'text-emerald-600' : 'text-gray-700'
              }`}
            >
              Properties
            </Link>
            {isAuthenticated && user?.role === 'landlord' && (
              <Link 
                to="/dashboard" 
                className={`text-sm font-medium hover:text-emerald-600 transition-colors ${
                  location.pathname === '/dashboard' ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
                Dashboard
              </Link>
              
            )}
            {isAuthenticated && user?.role === 'landlord' && (
              <Link 
                to="/profile" 
                className={`text-sm font-medium hover:text-emerald-600 transition-colors ${
                  location.pathname === '/profile' ? 'text-emerald-600' : 'text-gray-700'
                }`}
              >
               My Profile
              </Link>
              
            )}

          </nav>
          
          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {user?.role === 'landlord' && (
                  <Link to="/add-property" className="btn btn-primary flex items-center space-x-1">
                    <PlusCircle className="h-4 w-4" />
                    <span>Add Property</span>
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="btn btn-outline">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 focus:outline-none"
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
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`text-base font-medium p-2 rounded-md ${
                  location.pathname === '/' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link 
                to="/properties" 
                className={`text-base font-medium p-2 rounded-md ${
                  location.pathname === '/properties' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                }`}
              >
                Properties
              </Link>
              {isAuthenticated && user?.role === 'landlord' && (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`text-base font-medium p-2 rounded-md ${
                      location.pathname === '/dashboard' ? 'bg-emerald-50 text-emerald-600' : 'text-gray-700'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/add-property" 
                    className="text-base font-medium p-2 rounded-md bg-emerald-100 text-emerald-700 flex items-center space-x-2"
                  >
                    <PlusCircle className="h-5 w-5" />
                    <span>Add Property</span>
                  </Link>
                </>
              )}
              
              {isAuthenticated ? (
                <button 
                  onClick={handleLogout}
                  className="text-base font-medium p-2 rounded-md text-red-600 flex items-center space-x-2"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-100">
                  <Link to="/login" className="btn btn-outline text-center">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary text-center">
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