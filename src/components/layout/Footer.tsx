import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">NyumbaPaeasy</span>
            </div>
            <p className="text-sm mb-4">
              Find your perfect home in Malawi with ease. We connect property owners 
              with those seeking comfortable and affordable accommodations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-emerald-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/properties" className="text-sm hover:text-emerald-500 transition-colors">Properties</Link>
              </li>
              <li>
                <Link to="/register" className="text-sm hover:text-emerald-500 transition-colors">Register</Link>
              </li>
              <li>
                <Link to="/login" className="text-sm hover:text-emerald-500 transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          
          {/* Property Types */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Property Types</h3>
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
          <nav>
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/contact">Contact</a></li>
    <li><a href="/faq">FAQ</a></li>
    <li><a href="/use-policy">Use Policy</a></li>
  </ul>
</nav>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">+265 999 771 155</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-emerald-500 mt-0.5" />
                <span className="text-sm">info@nyumbapaeasy.com</span>
              </li>
              <li className="text-sm">
                Bingu National Stadium E14, Lilongwe<br />
                Malawi
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center">
          <p>&copy; {currentYear} NyumbaPaeasy. All rights reserved. A product of <a href='octetsystems.com'> Octet Systems </a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;