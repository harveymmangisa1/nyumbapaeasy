import React from 'react';

const UsePolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Use and Privacy Policy</h1>
      <h2 className="text-2xl font-bold mt-6 mb-4">Terms of Use</h2>
      <p className="mb-4">
        By using NyumbaPaeasy, you agree to comply with our terms of use. You are responsible for ensuring that all information you provide is accurate and up-to-date.
      </p>
      <h2 className="text-2xl font-bold mt-6 mb-4">Privacy Policy</h2>
      <p className="mb-4">
        We value your privacy. Any personal information you provide will be used solely for the purpose of providing our services. We do not share your data with third parties without your consent.
      </p>
    </div>
  );
};

export default UsePolicyPage;