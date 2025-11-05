import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: '#' },
    { icon: Twitter, href: '#' },
    { icon: Instagram, href: '#' },
  ];

  const linkSections = [
    {
      title: 'Quick Links',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'About Us', to: '/about' },
        { label: 'Contact', to: '/contact' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'FAQ', to: '/faq' },
        { label: 'Blog', to: '/blog' }, // Example link
        { label: 'Guides', to: '/guides' }, // Example link
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & Conditions', to: '/terms' },
        { label: 'Privacy Policy', to: '/privacy' },
        { label: 'Cookie Policy', to: '/cookies' },
      ],
    },
  ];

  return (
    <footer className="bg-primary text-gray-300">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
                <div className="flex items-center justify-center w-10 h-10 bg-accent rounded-lg">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-surface">NyumbaPaeasy</span>
            </Link>
            <p className="text-sm text-gray-400 mb-6">
              Your one-stop platform for finding rental properties in Malawi.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white bg-secondary/50 hover:bg-accent p-2 rounded-full transition-colors duration-300">
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {linkSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-md font-semibold text-surface mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-400 hover:text-accent hover:underline underline-offset-4 transition-colors duration-300">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="border-t border-secondary mt-10 pt-6 text-sm text-gray-400 text-center">
          <p>&copy; {currentYear} NyumbaPaeasy. All rights reserved. A product of <a href='https://octetsystems.com' target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Octet Systems</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;