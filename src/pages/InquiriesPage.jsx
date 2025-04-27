import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUser } from '../context/UserContext';

const InquiriesPage: React.FC = () => {
  const { user } = useUser();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'inquiries'),
          where('landlordId', '==', user?.id)
        );
        const querySnapshot = await getDocs(q);
        const inquiriesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInquiries(inquiriesData);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchInquiries();
    }
  }, [user]);

  if (loading) {
    return <div>Loading inquiries...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Inquiries</h1>
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <ul>
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="mb-4">
              <h2 className="font-bold">{inquiry.propertyName}</h2>
              <p>From: {inquiry.inquirerName}</p>
              <p>Date: {new Date(inquiry.createdAt.seconds * 1000).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InquiriesPage;