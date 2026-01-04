
export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  categoryId: number;
  quantity: number;
  price: number;
  supplierName: string;
  lastUpdated: string;
}

export interface User {
  id: number;
  username: string;
  role: 'admin' | 'staff';
  password?: string; // For mock authentication
}

export type TransactionType = 'purchase' | 'sale';

export interface Transaction {
  id: number;
  productId: number;
  type: TransactionType;
  quantity: number;
  pricePerItem: number;
  date: string;
}

export interface Notification {
  id: number;
  type: 'lowStock' | 'outOfStock';
  message: string;
  productId: number;
  productName: string;
  isRead: boolean;
  timestamp: string;
}

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  details: string;
  timestamp: string;
}
