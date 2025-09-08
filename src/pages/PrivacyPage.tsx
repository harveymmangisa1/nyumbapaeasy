import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | NyumbaPaeasy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Privacy Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <p className="mb-6 text-gray-700">
              At NyumbaPaeasy, we are committed to protecting your privacy. This Privacy Policy explains how we 
              collect, use, disclose, and safeguard your information when you visit our website nyumbapaeasy.com, 
              including any other media form, media channel, mobile website or mobile application related or 
              connected thereto (collectively, the "Site").
            </p>
            
            <p className="mb-6 text-gray-700">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the Site.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
            <p className="mb-4 text-gray-700">
              We collect personal information that you voluntarily provide to us when expressing an interest in 
              obtaining information about us or our products and services, when participating in activities on 
              the Site, or otherwise contacting us.
            </p>
            <p className="mb-6 text-gray-700">
              The personal information we collect may include:
            </p>
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Postal address</li>
              <li>Property information (if you are a landlord)</li>
              <li>Financial information (for transactions)</li>
              <li>Identification documents (for verification purposes)</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Derivative Information</h3>
            <p className="mb-6 text-gray-700">
              Information our servers automatically collect when you access the Site, such as your IP address, 
              your browser type, your operating system, your access times, and the pages you have viewed directly 
              before and after accessing the Site.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Financial Information</h3>
            <p className="mb-6 text-gray-700">
              We may collect financial information (such as credit card number and expiration date) when you make 
              purchases or transactions on our Site. This information is used solely to complete the purchase 
              transaction and will not be stored on our servers.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Use of Your Information</h2>
            <p className="mb-4 text-gray-700">Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li>Create and manage your account</li>
              <li>Process transactions and send related information</li>
              <li>Send you marketing and promotional communications</li>
              <li>Respond to your comments, questions, and provide customer service</li>
              <li>Monitor and analyze usage and trends</li>
              <li>Improve our Site and enhance user experience</li>
              <li>Enforce our terms and conditions</li>
              <li>Prevent fraudulent transactions</li>
              <li>Protect against harm to the rights, property, or safety of NyumbaPaeasy, our users, or the public</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Disclosure of Your Information</h2>
            <p className="mb-4 text-gray-700">We may share information we collect about you in the following situations:</p>
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li><strong>Third-Party Service Providers:</strong> We may share your information with third-party service providers to monitor and analyze the use of our Site, facilitate payments, or perform other services on our behalf.</li>
              <li><strong>Compliance with Laws:</strong> We may disclose your information where we are required to do so by law, or where we believe such action is necessary to comply with legal obligations.</li>
              <li><strong>Vital Interests:</strong> We may disclose your information where we believe it is necessary to investigate, prevent, or take action regarding potential violations of our policies.</li>
              <li><strong>Business Transfers:</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Security of Your Information</h2>
            <p className="mb-6 text-gray-700">
              We use administrative, technical, and physical security measures to help protect your personal 
              information. While we have taken reasonable steps to secure the personal information you provide 
              to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, 
              and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-6 text-gray-700">
              We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Site to 
              help customize the Site and improve your experience. When you access the Site, your personal 
              information is automatically collected through these technologies.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Third-Party Websites</h2>
            <p className="mb-6 text-gray-700">
              The Site may contain links to third-party websites and applications. Please be aware that we are 
              not responsible for the privacy practices of such other sites. We encourage you to read the privacy 
              statements of any website you visit.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Retention of Your Information</h2>
            <p className="mb-6 text-gray-700">
              We will retain your personal information for as long as necessary to fulfill the purposes outlined 
              in this privacy policy unless a longer retention period is required or permitted by law.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Your Rights</h2>
            <p className="mb-4 text-gray-700">You have the right to:</p>
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li>Request access to your personal information</li>
              <li>Request correction of your personal information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to processing of your personal information</li>
              <li>Request restriction of processing your personal information</li>
              <li>Request transfer of your personal information</li>
              <li>Withdraw your consent</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="mb-6 text-gray-700">
              If you have questions or comments about this policy, you may <Link to="/contact" className="text-emerald-600 hover:underline">contact us</Link> at:
            </p>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-gray-700">
                <strong>NyumbaPaeasy</strong><br />
                Bingu National Stadium E14, Lilongwe<br />
                Malawi<br />
                Email: info@nyumbapaeasy.com<br />
                Phone: +265 999 771 155
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;