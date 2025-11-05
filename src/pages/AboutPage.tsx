import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">About NyumbaPaeasy</h1>
      
      <p className="mb-6 text-lg leading-relaxed text-gray-700">
        NyumbaPaeasy is proudly developed by Octet Systems to solve real challenges in the housing and rental market. 
        We recognize the frustration tenants face when agents waste their time and resources, often showing different 
        houses from what was initially promised, and limiting tenants' freedom to choose from multiple options due to 
        fear of added costs. Landlords, too, have long lacked direct access to prospective tenants, resulting in 
        inefficiencies and missed opportunities.
      </p>
      
      <p className="mb-6 text-lg leading-relaxed text-gray-700">
        NyumbaPaeasy transforms the process by offering a transparent, digital-first platform where landlords can 
        connect directly with potential tenants. With access to accurate listings, verified information, and full 
        property media (photos, videos, virtual tours), tenants can browse freely, compare options without pressure, 
        and make informed decisions. We empower users with choice, security, and control.
      </p>

      <h2 className="text-3xl font-semibold mt-10 mb-6 text-center">Our Commitment</h2>

      <p className="mb-6 text-lg leading-relaxed text-gray-700">
        Octet Systems is committed to innovation, integrity, and user experience. NyumbaPaeasy is more than just a platform; 
        it is a movement towards modernizing the rental process and rebuilding trust in the housing market. 
        We believe in giving landlords and tenants the tools they need for fair, open, and efficient property transactions.
      </p>

      <h2 className="text-3xl font-semibold mt-10 mb-6 text-center">Meet the Team</h2>

      <p className="text-lg leading-relaxed text-gray-700">
        Behind NyumbaPaeasy is a team of passionate technologists, real estate experts, and designers driven by a vision 
        to create lasting impact. At Octet Systems, we work tirelessly to ensure that every feature, update, and 
        interaction on our platform reflects our mission to connect, empower, and transform.
      </p>
    </div>
  );
};

export default AboutPage;
