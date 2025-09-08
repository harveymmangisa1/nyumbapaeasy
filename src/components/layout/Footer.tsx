import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, Facebook, Twitter, Instagram, MapPin, Building, Users, FileText, Info } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">NyumbaPaeasy</span>
            </div>
            <p className="text-sm mb-4">
              Find your perfect home in Malawi with ease. We connect property owners 
              with those seeking comfortable and affordable accommodations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gray-800 p-2 rounded-full">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Home className="h-5 w-5 mr-2 text-emerald-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-emerald-500 transition-colors flex items-center">
                  <span className="ml-2">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm hover:text-emerald-500 transition-colors flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  <span>Properties</span>
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-emerald-500 transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Register</span>
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-emerald-500 transition-colors flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Property Types */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2 text-emerald-500" />
              Property Types
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/properties?type=house" className="text-sm hover:text-emerald-500 transition-colors">Houses</Link>
              </li>
              <li>
                <Link to="/properties?type=apartment" className="text-sm hover:text-emerald-500 transition-colors">Apartments</Link>
              </li>
              <li>
                <Link to="/properties?type=room" className="text-sm hover:text-emerald-500 transition-colors">Rooms</Link>
              </li>
              <li>
                <Link to="/properties?type=commercial" className="text-sm hover:text-emerald-500 transition-colors">Commercial Properties</Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Info className="h-5 w-5 mr-2 text-emerald-500" />
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm hover:text-emerald-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-emerald-500 transition-colors">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm hover:text-emerald-500 transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-emerald-500" />
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm hover:text-emerald-500 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-emerald-500 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm hover:text-emerald-500 transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link to="/use-policy" className="text-sm hover:text-emerald-500 transition-colors">Use Policy</Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-emerald-500" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">+265 999 771 155</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">info@nyumbapaeasy.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">
                  Bingu National Stadium E14, Lilongwe<br />
                  Malawi
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-sm text-center">
          <p>&copy; {currentYear} NyumbaPaeasy. All rights reserved. A product of <a href='https://octetsystems.com' target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300">Octet Systems</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;