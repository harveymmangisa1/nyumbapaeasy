import React, { useState } from 'react';

const FAQPage: React.FC = () => {
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const faqs = [
    { question: 'How do I list a property?', answer: 'To list a property, log in to your account, go to the "Add Property" page, and fill out the required details.' },
    { question: 'How do I contact a landlord?', answer: 'You can contact a landlord by submitting an inquiry on the property details page.' },
    { question: 'Is NyumbaPaeasy free to use?', answer: 'Yes, NyumbaPaeasy is free for tenants. Landlords may have premium options for featured listings.' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md p-4">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full text-left font-medium text-gray-700"
            >
              {faq.question}
            </button>
            {openQuestion === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;