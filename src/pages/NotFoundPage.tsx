import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Icon/Number */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20">404</div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        
        <p className="text-text-secondary text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
          
          <Link to="/" className="btn btn-primary flex items-center justify-center">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <Link to="/properties" className="btn btn-secondary flex items-center justify-center">
            <Search className="h-4 w-4 mr-2" />
            Browse Properties
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-surface rounded-lg border border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Looking for something?
          </h2>
          <div className="space-y-2 text-sm">
            <Link to="/properties" className="block text-text-secondary hover:text-primary transition-colors">
              → Browse our property listings
            </Link>
            <Link to="/about" className="block text-text-secondary hover:text-primary transition-colors">
              → Learn about NyumbaPaeasy
            </Link>
            <Link to="/contact" className="block text-text-secondary hover:text-primary transition-colors">
              → Contact our support team
            </Link>
            <Link to="/faq" className="block text-text-secondary hover:text-primary transition-colors">
              → Visit our FAQ page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;