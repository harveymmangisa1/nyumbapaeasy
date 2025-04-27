import { Property } from '../context/PropertyContext';

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Spacious 3 Bedroom House in Area 47',
    description: 'A beautiful and spacious family home in a quiet neighborhood with excellent security. The house features a large living room, modern kitchen, and a garden. Perfect for families or professionals looking for comfort and convenience.',
    price: 450000,
    location: 'Area 47, Sector 4',
    district: 'Lilongwe',
    type: 'house',
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    isSelfContained: true,
    amenities: ['Garden', 'Parking', 'Security', 'Water Tank', 'Fence'],
    images: [
      'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg',
      'https://images.pexels.com/photos/1643384/pexels-photo-1643384.jpeg',
      'https://images.pexels.com/photos/1876045/pexels-photo-1876045.jpeg'
    ],
    landlordId: '1',
    landlordName: 'James Banda',
    landlordContact: '+265 999 123 456',
    createdAt: '2023-08-15T10:30:00Z',
    isFeatured: true
  },
  {
    id: '2',
    title: 'Modern 2 Bedroom Apartment near City Centre',
    description: 'Newly built apartment with modern finishes in the heart of Blantyre. Walking distance to shops, restaurants and offices. Includes balcony with city views and 24-hour security.',
    price: 350000,
    location: 'Namiwawa',
    district: 'Blantyre',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    isSelfContained: true,
    amenities: ['Balcony', '24/7 Security', 'Water Tank', 'Parking'],
    images: [
      'https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg',
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg',
      'https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg'
    ],
    landlordId: '2',
    landlordName: 'Grace Phiri',
    landlordContact: '+265 888 345 678',
    createdAt: '2023-08-20T14:15:00Z',
    isFeatured: true
  },
  {
    id: '3',
    title: 'Cozy 1 Bedroom Self-Contained Unit',
    description: 'Perfect for singles or couples. This cozy unit comes with all basic amenities and is located in a secure compound with other units. Good access to public transport.',
    price: 120000,
    location: 'Chirimba',
    district: 'Blantyre',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    isSelfContained: true,
    amenities: ['Security Guard', 'Prepaid Electricity', 'Prepaid Water'],
    images: [
      'https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg',
      'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'
    ],
    landlordId: '3',
    landlordName: 'Thomas Gondwe',
    landlordContact: '+265 991 567 890',
    createdAt: '2023-09-05T09:45:00Z',
    isFeatured: false
  },
  {
    id: '4',
    title: 'Luxury 4 Bedroom Villa with Pool',
    description: 'Exclusive luxury villa in Nyambadwe with spectacular views. Features include a swimming pool, spacious garden, modern kitchen, and high-quality finishes throughout. Security and privacy guaranteed.',
    price: 950000,
    location: 'Nyambadwe',
    district: 'Blantyre',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    area: 350,
    isSelfContained: true,
    amenities: ['Swimming Pool', 'Garden', 'Security', 'Garage', 'Servant Quarters', 'Backup Generator'],
    images: [
      'https://images.pexels.com/photos/32870/pexels-photo.jpg',
      'https://images.pexels.com/photos/2462015/pexels-photo-2462015.jpeg',
      'https://images.pexels.com/photos/2091166/pexels-photo-2091166.jpeg'
    ],
    landlordId: '4',
    landlordName: 'Sarah Mutharika',
    landlordContact: '+265 999 789 012',
    createdAt: '2023-09-10T11:00:00Z',
    isFeatured: true
  },
  {
    id: '5',
    title: 'Single Room for Rent near College of Medicine',
    description: 'Clean and affordable single room ideal for students. Shared bathroom and kitchen facilities. Located within walking distance to College of Medicine and Queen Elizabeth Central Hospital.',
    price: 45000,
    location: 'Ginnery Corner',
    district: 'Blantyre',
    type: 'room',
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    isSelfContained: false,
    amenities: ['Communal Kitchen', 'Water Included', 'Security'],
    images: [
      'https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg',
      'https://images.pexels.com/photos/275484/pexels-photo-275484.jpeg'
    ],
    landlordId: '5',
    landlordName: 'Peter Kamanga',
    landlordContact: '+265 888 234 567',
    createdAt: '2023-09-15T13:20:00Z',
    isFeatured: false
  },
  {
    id: '6',
    title: 'Commercial Shop Space in Limbe Market Area',
    description: 'Prime commercial space available in the busy Limbe market area. High foot traffic and visibility. Suitable for retail, services, or office use.',
    price: 250000,
    location: 'Limbe Market',
    district: 'Blantyre',
    type: 'commercial',
    bedrooms: 0,
    bathrooms: 1,
    area: 75,
    isSelfContained: true,
    amenities: ['High Foot Traffic', 'Security Shutters', 'Storage Room'],
    images: [
      'https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg',
      'https://images.pexels.com/photos/109919/pexels-photo-109919.jpeg'
    ],
    landlordId: '6',
    landlordName: 'Charles Malunga',
    landlordContact: '+265 999 456 789',
    createdAt: '2023-09-20T15:45:00Z',
    isFeatured: false
  }
];