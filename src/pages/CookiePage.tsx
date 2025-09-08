import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookiePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Cookie Policy | NyumbaPaeasy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Cookie Policy</h1>
          <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <p className="mb-6 text-gray-700">
              This Cookie Policy explains how NyumbaPaeasy ("we", "us", or "our") uses cookies and similar 
              technologies to recognize you when you visit our website at nyumbapaeasy.com ("Website"). It explains 
              what these technologies are and why we use them, as well as your rights to control our use of them.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">What are cookies?</h2>
            <p className="mb-6 text-gray-700">
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
              Cookies are widely used by website owners in order to make their websites work, or to work more 
              efficiently, as well as to provide reporting information.
            </p>
            
            <p className="mb-6 text-gray-700">
              Cookies set by the website owner (in this case, NyumbaPaeasy) are called "first party cookies". 
              Cookies set by parties other than the website owner are called "third party cookies". Third party 
              cookies enable third party features or functionality to be provided on or through the website 
              (e.g. advertising, interactive content and analytics). The parties that set these third party 
              cookies can recognize your computer both when it visits the website in question and also when 
              it visits certain other websites.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Why do we use cookies?</h2>
            <p className="mb-6 text-gray-700">
              We use first party and third party cookies for several reasons. Some cookies are required for 
              technical reasons in order for our Website to operate, and we refer to these as "essential" or 
              "strictly necessary" cookies. Other cookies also enable us to track and target the interests of 
              our users to enhance the experience on our Website. Third parties serve cookies through our 
              Website for advertising, analytics and other purposes.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Types of cookies we use</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Essential website cookies</h3>
            <p className="mb-4 text-gray-700">
              These cookies are strictly necessary to provide you with services available through our Website 
              and to use some of its features, such as access to secure areas.
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sessionid</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Maintains user session</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTTP Cookie</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Session</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">csrftoken</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Prevents cross-site request forgery</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTTP Cookie</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Performance and functionality cookies</h3>
            <p className="mb-4 text-gray-700">
              These cookies are used to enhance the performance and functionality of our Website but are 
              non-essential to their use. However, without these cookies, certain functionality may become 
              unavailable.
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">preferences</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Stores user preferences</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NyumbaPaeasy</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTTP Cookie</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Analytics and customization cookies</h3>
            <p className="mb-4 text-gray-700">
              These cookies collect information that is used either in aggregate form to help us understand 
              how our Website is being used or how effective our marketing campaigns are, or to help us 
              customize our Website for you.
            </p>
            
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expires</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_ga</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Registers a unique ID that is used to generate statistical data on how the visitor uses the website</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Analytics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTTP Cookie</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2 years</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">_gid</td>
                    <td className="px-6 py-4 text-sm text-gray-500">Registers a unique ID that is used to generate statistical data on how the visitor uses the website</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Analytics</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">HTTP Cookie</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 day</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">How can you control cookies?</h2>
            <p className="mb-6 text-gray-700">
              You have the right to decide whether to accept or reject cookies. You can enable or disable 
              cookies by adjusting the settings on your browser. However, if you choose to disable cookies, 
              you may be unable to access certain parts of our Website.
            </p>
            
            <p className="mb-6 text-gray-700">
              Most browsers allow you to:
            </p>
            
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li>Delete cookies</li>
              <li>Block all cookies</li>
              <li>Block third-party cookies</li>
              <li>Clear all cookies when you close your browser</li>
              <li>Open a "do not track" request</li>
            </ul>
            
            <p className="mb-6 text-gray-700">
              For more information about how to manage cookies, please visit <a href="https://www.allaboutcookies.org/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">allaboutcookies.org</a>.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Changes to this Cookie Policy</h2>
            <p className="mb-6 text-gray-700">
              We may update this Cookie Policy from time to time in order to reflect, for example, changes 
              to the cookies we use or for other operational, legal or regulatory reasons. Please therefore 
              re-visit this Cookie Policy regularly to stay informed about our use of cookies and related 
              technologies.
            </p>
            
            <p className="mb-6 text-gray-700">
              The date at the top of this Cookie Policy indicates when it was last updated.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Contact Us</h2>
            <p className="mb-6 text-gray-700">
              If you have any questions about our use of cookies or other technologies, please <Link to="/contact" className="text-emerald-600 hover:underline">contact us</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePage;