// Declaration for JSX files
declare module '*.jsx' {
  import React from 'react';
  const component: React.FC;
  export default component;
}

// Declaration for EditPropertyPage.jsx
declare module './pages/EditPropertyPage.jsx' {
  import React from 'react';
  const EditPropertyPage: React.FC;
  export default EditPropertyPage;
}

// Declaration for InquiriesPage.jsx
declare module './pages/InquiriesPage.jsx' {
  import React from 'react';
  const InquiriesPage: React.FC;
  export default InquiriesPage;
}

// Declaration for lucide-react
declare module 'lucide-react';