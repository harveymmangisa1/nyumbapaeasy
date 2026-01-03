import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, User, PlusCircle, LogOut, CheckCircle, Clock, Building, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Navigation configuration - centralized for easy maintenance
const NAV_LINKS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/properties', label: 'Properties', icon: Building },
];

const RESOURCES_LINKS = [
  { path: '/about', label: 'About Us' },
  { path: '/faq', label: 'FAQ' },
  { path: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { path: '/terms', label: 'Terms & Conditions' },
  { path: '/privacy', label: 'Privacy Policy' },
  { path: '/cookies', label: 'Cookie Policy' },
];

const ROLE_DASHBOARDS = {
  landlord: { path: '/dashboard', label: 'Dashboard' },
  admin: { path: '/admin/dashboard', label: 'Admin Panel' },
  real_estate_agency: { path: '/agency/dashboard', label: 'Agency Dashboard' },
};

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const resourcesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect with passive listener for better performance
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsResourcesOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target as Node)) {
        setIsResourcesOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  // Computed values
  const canListProperty = user && ['landlord', 'admin', 'real_estate_agency', 'lodge_owner', 'bnb_owner'].includes(user.profile.role);
  const userDashboard = user ? ROLE_DASHBOARDS[user.profile.role as keyof typeof ROLE_DASHBOARDS] : null;

  // Verification Badge Component
  const VerificationBadge = () => {
    if (!user) return null;

    if (user.profile.is_verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          <CheckCircle className="w-3 h-3" />
          Verified
        </span>
      );
    }

    if (user.profile.has_pending_verification) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    }

    return null;
  };

  // User Avatar Component
  const UserAvatar = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg'
    };

    if (user?.profile.avatar_url) {
      return (
        <img
          src={user.profile.avatar_url}
          alt={user.profile?.name || 'User'}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.innerHTML = `<div class="${sizeClasses[size]} rounded-full bg-primary text-white flex items-center justify-center font-semibold">${(user.profile?.name?.[0] || user.email[0]).toUpperCase()}</div>`;
            }
          }}
        />
      );
    }

    return (
      <div className={`${sizeClasses[size]} rounded-full bg-primary text-white flex items-center justify-center font-semibold`}>
        {(user?.profile?.name?.[0] || user?.email[0] || 'U').toUpperCase()}
      </div>
    );
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary font-bold text-xl hover:opacity-80 transition-opacity"
            aria-label="NyumbaPaeasy Home"
          >
            <Home className="w-6 h-6" />
            <span>NyumbaPaeasy</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`nav-link ${location.pathname === path ? 'active' : ''}`}
              >
                <Icon className="w-4 h-4 mr-1" />
                {label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative" ref={resourcesRef}>
              <button
                onClick={() => setIsResourcesOpen(!isResourcesOpen)}
                onKeyDown={(e) => handleKeyDown(e, () => setIsResourcesOpen(!isResourcesOpen))}
                aria-expanded={isResourcesOpen}
                aria-haspopup="true"
                className={`nav-link ${isResourcesOpen ? 'active' : ''}`}
              >
                Resources
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isResourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isResourcesOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200 animate-fadeIn">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Information
                  </div>
                  {RESOURCES_LINKS.map(({ path, label }) => (
                    <Link key={path} to={path} className="dropdown-link">
                      {label}
                    </Link>
                  ))}

                  <div className="my-2 border-t border-gray-200" />

                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Legal
                  </div>
                  {LEGAL_LINKS.map(({ path, label }) => (
                    <Link key={path} to={path} className="dropdown-link">
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {canListProperty && (
                  <Link
                    to="/add-property"
                    className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    List Property
                  </Link>
                )}

                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    onKeyDown={(e) => handleKeyDown(e, () => setIsUserMenuOpen(!isUserMenuOpen))}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-expanded={isUserMenuOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                  >
                    <UserAvatar size="md" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-900">{user.profile?.name || user.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.profile.role?.replace('_', ' ')}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200 animate-fadeIn">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.profile?.name || user.email}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        <div className="mt-2">
                          <VerificationBadge />
                        </div>
                      </div>

                      <Link to="/profile" className="dropdown-link">
                        <User className="w-4 h-4 mr-2 inline" />
                        My Profile
                      </Link>

                      {userDashboard && (
                        <Link to={userDashboard.path} className="dropdown-link">
                          <Building className="w-4 h-4 mr-2 inline" />
                          {userDashboard.label}
                        </Link>
                      )}

                      <div className="my-2 border-t border-gray-200" />

                      <button
                        onClick={handleLogout}
                        className="dropdown-link w-full text-left text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <LogOut className="w-4 h-4 mr-2 inline" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary font-medium hover:text-primary-dark transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 space-y-2 animate-slideDown shadow-xl z-50 max-h-[calc(100vh-64px)] overflow-y-auto">
            {NAV_LINKS.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} className="mobile-nav-link">
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Link>
            ))}

            <div className="py-2">
              <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Resources
              </p>
              {[...RESOURCES_LINKS, ...LEGAL_LINKS].map(({ path, label }) => (
                <Link key={path} to={path} className="mobile-nav-link pl-6 text-sm">
                  {label}
                </Link>
              ))}
            </div>

            {user ? (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 px-3 py-2 mb-3">
                  <UserAvatar size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.profile?.name || user.email}</p>
                    <p className="text-xs text-gray-500 capitalize truncate">{user.profile.role?.replace('_', ' ')}</p>
                    <div className="mt-1">
                      <VerificationBadge />
                    </div>
                  </div>
                </div>

                <Link to="/profile" className="mobile-nav-link">
                  <User className="w-5 h-5 mr-2" />
                  My Profile
                </Link>

                {canListProperty && (
                  <Link to="/add-property" className="mobile-nav-link text-primary">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    List Property
                  </Link>
                )}

                {userDashboard && (
                  <Link to={userDashboard.path} className="mobile-nav-link">
                    <Building className="w-5 h-5 mr-2" />
                    {userDashboard.label}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="mobile-nav-link w-full text-left text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link to="/login" className="mobile-nav-link">
                  Login
                </Link>
                <Link to="/register" className="mobile-nav-link bg-primary text-white hover:bg-primary-dark">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;