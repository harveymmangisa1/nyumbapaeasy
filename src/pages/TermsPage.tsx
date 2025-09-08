import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const TermsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Terms and Conditions | NyumbaPaeasy';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Terms and Conditions</h1>
          <p className="text-gray-600 mb-8">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose max-w-none">
            <p className="mb-6 text-gray-700">
              Welcome to NyumbaPaeasy. These terms and conditions outline the rules and regulations for the use of 
              NyumbaPaeasy's Website, located at nyumbapaeasy.com.
            </p>
            
            <p className="mb-6 text-gray-700">
              By accessing this website we assume you accept these terms and conditions. Do not continue to use 
              NyumbaPaeasy if you do not agree to take all of the terms and conditions stated on this page.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Intellectual Property Rights</h2>
            <p className="mb-4 text-gray-700">
              Other than the content you own, under these Terms, NyumbaPaeasy and/or its licensors own all the 
              intellectual property rights and materials contained in this Website.
            </p>
            <p className="mb-6 text-gray-700">
              You are granted limited license only for purposes of viewing the material contained on this Website.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Restrictions</h2>
            <p className="mb-4 text-gray-700">You are specifically restricted from all of the following:</p>
            <ul className="list-disc pl-8 mb-6 text-gray-700 space-y-2">
              <li>Publishing any Website material in any other media</li>
              <li>Selling, sublicensing and/or otherwise commercializing any Website material</li>
              <li>Publicly performing and/or showing any Website material</li>
              <li>Using this Website in any way that is or may be damaging to this Website</li>
              <li>Using this Website in any way that impacts user access to this Website</li>
              <li>Using this Website contrary to applicable laws and regulations</li>
              <li>Engaging in any data mining, data harvesting, data extracting or any other similar activity</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">User Content</h2>
            <p className="mb-6 text-gray-700">
              In these Website standard terms and conditions, "Your Content" shall mean any audio, video text, 
              images or other material you choose to display on this Website. By displaying Your Content, you grant 
              NyumbaPaeasy a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce, adapt, 
              publish, translate and distribute it in any and all media.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">No warranties</h2>
            <p className="mb-6 text-gray-700">
              This Website is provided "as is," with all faults, and NyumbaPaeasy express no representations or 
              warranties, of any kind related to this Website or the materials contained on this Website. Also, 
              nothing contained on this Website shall be interpreted as advising you.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Limitation of liability</h2>
            <p className="mb-6 text-gray-700">
              In no event shall NyumbaPaeasy, nor any of its officers, directors and employees, shall be held liable 
              for anything arising out of or in any way connected with your use of this Website whether such liability 
              is under contract. NyumbaPaeasy, including its officers, directors and employees shall not be held liable 
              for any indirect, consequential or special liability arising out of or in any way related to your use of 
              this Website.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Indemnification</h2>
            <p className="mb-6 text-gray-700">
              You hereby indemnify to the fullest extent NyumbaPaeasy from and against any and/or all liabilities, 
              costs, demands, causes of action, damages and expenses arising in any way related to your breach of any 
              of the provisions of these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Severability</h2>
            <p className="mb-6 text-gray-700">
              If any provision of these Terms is found to be invalid under any applicable law, such provisions shall 
              be deleted without affecting the remaining provisions herein.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Variation of Terms</h2>
            <p className="mb-6 text-gray-700">
              NyumbaPaeasy is permitted to revise these Terms at any time as it sees fit, and by using this Website 
              you are expected to review these Terms on a regular basis.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Assignment</h2>
            <p className="mb-6 text-gray-700">
              The NyumbaPaeasy is allowed to assign, transfer, and subcontract its rights and/or obligations under 
              these Terms without any notification. However, you are not allowed to assign, transfer, or subcontract 
              any of your rights and/or obligations under these Terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Entire Agreement</h2>
            <p className="mb-6 text-gray-700">
              These Terms constitute the entire agreement between NyumbaPaeasy and you in relation to your use of 
              this Website, and supersede all prior agreements and understandings.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Governing Law & Jurisdiction</h2>
            <p className="mb-6 text-gray-700">
              These Terms will be governed by and interpreted in accordance with the laws of the Republic of Malawi, 
              and you submit to the non-exclusive jurisdiction of the state and federal courts located in Malawi for 
              the resolution of any disputes.
            </p>
            
            <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-gray-700">
                If you have any questions about these Terms and Conditions, please <Link to="/contact" className="text-emerald-600 hover:underline">contact us</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
