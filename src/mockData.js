// ============================================================
// Mock data — shaped to match the real API structure
// Swap each array/fetch for an axios.get() when backend is ready
// ============================================================

// ----------------------------
// ORDERS
// ----------------------------
export const mockOrders = [
  { id: 'ORD-089', client: 'Olivia Turner',  service: 'Logo Design',        status: 'Pending',     date: '2026-07-04', amount: 120, files: 0 },
  { id: 'ORD-088', client: 'James Wright',   service: 'Video Editing',       status: 'In Progress', date: '2026-07-03', amount: 350, files: 2 },
  { id: 'ORD-087', client: 'Sophia Chen',    service: 'Content Writing',     status: 'Completed',   date: '2026-07-02', amount: 80,  files: 3 },
  { id: 'ORD-086', client: 'Liam Parker',    service: 'PDF Conversion',      status: 'Completed',   date: '2026-07-01', amount: 45,  files: 1 },
  { id: 'ORD-085', client: 'Ava Johnson',    service: 'UI/UX Design',        status: 'Cancelled',   date: '2026-06-30', amount: 250, files: 0 },
  { id: 'ORD-084', client: 'Noah Williams',  service: 'Branding Package',    status: 'Completed',   date: '2026-06-29', amount: 500, files: 5 },
  { id: 'ORD-083', client: 'Emma Brown',     service: 'Social Media Kit',    status: 'In Progress', date: '2026-06-28', amount: 175, files: 1 },
  { id: 'ORD-082', client: 'Mason Davis',    service: 'Excel to PDF',        status: 'Completed',   date: '2026-06-27', amount: 30,  files: 2 },
  { id: 'ORD-081', client: 'Isabella Miller','service': 'Presentation Design',status: 'Pending',    date: '2026-06-26', amount: 200, files: 0 },
  { id: 'ORD-080', client: 'Ethan Wilson',   service: 'Content Writing',     status: 'Completed',   date: '2026-06-25', amount: 95,  files: 4 },
  { id: 'ORD-079', client: 'Harper Moore',   service: 'Logo Design',        status: 'In Progress', date: '2026-06-24', amount: 140, files: 1 },
  { id: 'ORD-078', client: 'Aiden Taylor',   service: 'PDF Conversion',      status: 'Cancelled',   date: '2026-06-23', amount: 55,  files: 0 },
];

// ----------------------------
// CUSTOMERS
// ----------------------------
export const mockCustomers = [
  { id: 'USR-001', name: 'Olivia Turner',   email: 'olivia@mail.com',   phone: '+1 555-0201', orders: 5,  joined: '2025-11-12', status: 'Active',    spend: 680  },
  { id: 'USR-002', name: 'James Wright',    email: 'james@mail.com',    phone: '+1 555-0202', orders: 3,  joined: '2025-12-01', status: 'Active',    spend: 430  },
  { id: 'USR-003', name: 'Sophia Chen',     email: 'sophia@mail.com',   phone: '+1 555-0203', orders: 8,  joined: '2025-09-18', status: 'Active',    spend: 1240 },
  { id: 'USR-004', name: 'Liam Parker',     email: 'liam@mail.com',     phone: '+1 555-0204', orders: 1,  joined: '2026-01-05', status: 'Inactive',  spend: 45   },
  { id: 'USR-005', name: 'Ava Johnson',     email: 'ava@mail.com',      phone: '+1 555-0205', orders: 2,  joined: '2026-02-20', status: 'Active',    spend: 330  },
  { id: 'USR-006', name: 'Noah Williams',   email: 'noah@mail.com',     phone: '+1 555-0206', orders: 6,  joined: '2025-08-14', status: 'Active',    spend: 1870 },
  { id: 'USR-007', name: 'Emma Brown',      email: 'emma@mail.com',     phone: '+1 555-0207', orders: 4,  joined: '2025-10-07', status: 'Active',    spend: 795  },
  { id: 'USR-008', name: 'Mason Davis',     email: 'mason@mail.com',    phone: '+1 555-0208', orders: 2,  joined: '2026-03-11', status: 'Suspended', spend: 60   },
  { id: 'USR-009', name: 'Isabella Miller', email: 'isabella@mail.com', phone: '+1 555-0209', orders: 1,  joined: '2026-04-22', status: 'Active',    spend: 200  },
  { id: 'USR-010', name: 'Ethan Wilson',    email: 'ethan@mail.com',    phone: '+1 555-0210', orders: 9,  joined: '2025-07-03', status: 'Active',    spend: 2100 },
  { id: 'USR-011', name: 'Harper Moore',    email: 'harper@mail.com',   phone: '+1 555-0211', orders: 3,  joined: '2026-05-01', status: 'Active',    spend: 415  },
  { id: 'USR-012', name: 'Aiden Taylor',    email: 'aiden@mail.com',    phone: '+1 555-0212', orders: 1,  joined: '2026-06-15', status: 'Inactive',  spend: 55   },
];

// ----------------------------
// REVIEWS
// ----------------------------
export const mockReviews = [
  { id: 'REV-001', reviewer: 'Olivia Turner',   orderId: 'ORD-086', rating: 5, comment: 'Absolutely fantastic work! Delivered on time and exceeded expectations.', date: '2026-07-03', status: 'Published' },
  { id: 'REV-002', reviewer: 'Sophia Chen',     orderId: 'ORD-087', rating: 4, comment: 'Great quality writing, minor revisions needed but overall great experience.', date: '2026-07-02', status: 'Published' },
  { id: 'REV-003', reviewer: 'Noah Williams',   orderId: 'ORD-084', rating: 5, comment: 'Best branding package I\'ve ever gotten. Highly recommend!', date: '2026-07-01', status: 'Published' },
  { id: 'REV-004', reviewer: 'Ethan Wilson',    orderId: 'ORD-080', rating: 3, comment: 'Content was okay but took longer than expected. Could improve communication.', date: '2026-06-30', status: 'Published' },
  { id: 'REV-005', reviewer: 'Mason Davis',     orderId: 'ORD-082', rating: 5, comment: 'Super fast PDF conversion. Exactly what I needed!', date: '2026-06-29', status: 'Published' },
  { id: 'REV-006', reviewer: 'Emma Brown',      orderId: 'ORD-083', rating: 2, comment: 'This is spam content. CLICK HERE for free stuff.', date: '2026-06-28', status: 'Flagged'   },
  { id: 'REV-007', reviewer: 'Harper Moore',    orderId: 'ORD-079', rating: 4, comment: 'Very professional logo design. Loved the color palette they chose.', date: '2026-06-27', status: 'Published' },
  { id: 'REV-008', reviewer: 'Isabella Miller', orderId: 'ORD-081', rating: 1, comment: 'Order still pending, not sure what\'s happening.', date: '2026-06-26', status: 'Hidden'    },
];

// ----------------------------
// WORKING FILES
// ----------------------------
export const mockFiles = [
  { id: 'FILE-001', name: 'brand-guidelines-v2.pdf',   orderId: 'ORD-084', uploadedBy: 'Noah Williams',   type: 'PDF',  size: '4.2 MB', date: '2026-07-01', status: 'Approved'  },
  { id: 'FILE-002', name: 'logo-final-export.zip',     orderId: 'ORD-089', uploadedBy: 'Admin',          type: 'ZIP',  size: '12.8 MB', date: '2026-07-03', status: 'Pending'   },
  { id: 'FILE-003', name: 'content-draft-1.docx',      orderId: 'ORD-087', uploadedBy: 'Sophia Chen',    type: 'DOCX', size: '0.8 MB', date: '2026-07-02', status: 'Approved'  },
  { id: 'FILE-004', name: 'video-raw-footage.mp4',     orderId: 'ORD-088', uploadedBy: 'James Wright',   type: 'MP4',  size: '240 MB', date: '2026-07-03', status: 'Pending'   },
  { id: 'FILE-005', name: 'invoice-ORD-086.pdf',       orderId: 'ORD-086', uploadedBy: 'Admin',          type: 'PDF',  size: '0.2 MB', date: '2026-07-01', status: 'Approved'  },
  { id: 'FILE-006', name: 'social-media-kit.zip',      orderId: 'ORD-083', uploadedBy: 'Emma Brown',     type: 'ZIP',  size: '22.5 MB', date: '2026-06-28', status: 'Rejected'  },
  { id: 'FILE-007', name: 'presentation-v1.pptx',      orderId: 'ORD-081', uploadedBy: 'Admin',          type: 'PPTX', size: '8.1 MB', date: '2026-06-26', status: 'Pending'   },
  { id: 'FILE-008', name: 'excel-converted.pdf',       orderId: 'ORD-082', uploadedBy: 'Mason Davis',    type: 'PDF',  size: '1.1 MB', date: '2026-06-27', status: 'Approved'  },
  { id: 'FILE-009', name: 'ux-wireframes.fig',         orderId: 'ORD-085', uploadedBy: 'Ava Johnson',    type: 'FIG',  size: '5.4 MB', date: '2026-06-30', status: 'Rejected'  },
  { id: 'FILE-010', name: 'content-final.docx',        orderId: 'ORD-080', uploadedBy: 'Ethan Wilson',   type: 'DOCX', size: '0.6 MB', date: '2026-06-25', status: 'Approved'  },
];
