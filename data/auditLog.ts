
import { type AuditLog } from '../types';

export const initialAuditLogs: AuditLog[] = [
  {
    id: 1,
    user: 'admin',
    action: 'Stock Update',
    details: 'Quantity for "Stainless Steel Water Bottle" changed from 58 to 8 (-50).',
    timestamp: '2023-10-27T11:00:00Z',
  },
  {
    id: 2,
    user: 'admin',
    action: 'Product Edited',
    details: 'Edited "Organic Matcha": price from \'25.99\' to \'24.99\'',
    timestamp: '2023-10-26T10:00:00Z',
  },
  {
    id: 3,
    user: 'admin',
    action: 'Product Added',
    details: 'Added new product: "Natural Almond Butter" (SKU: GRO-NAB-005).',
    timestamp: '2023-10-26T09:30:00Z',
  },
  {
    id: 4,
    user: 'admin',
    action: 'Product Deleted',
    details: 'Deleted product: "Old Product Name" (SKU: OLD-SKU-001).',
    timestamp: '2023-10-25T15:00:00Z',
  },
];
