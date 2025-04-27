import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const InquiryDetailsPage: React.FC = () => {
  const { id } = useParams(); // Inquiry ID from URL
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiry = async () => {
      setLoading(true);
      try {
        const inquiryRef = doc(db, 'inquiries', id);
        const inquirySnap = await getDoc(inquiryRef);

        if (inquirySnap.exists()) {
          setInquiry(inquirySnap.data());
        } else {
          console.error('Inquiry not found');
        }
      } catch (error) {
        console.error('Error fetching inquiry:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiry();
  }, [id]);

  if (loading) {
    return <div>Loading inquiry details...</div>;
  }

  if (!inquiry) {
    return <div>Inquiry not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inquiry Details</h1>
      <p><strong>Property:</strong> {inquiry.propertyName}</p>
      <p><strong>Inquirer:</strong> {inquiry.inquirerName}</p>
      <p><strong>Message:</strong> {inquiry.message}</p>
      <p><strong>Contact:</strong> {inquiry.contact}</p>
    </div>
  );
};

export default InquiryDetailsPage;