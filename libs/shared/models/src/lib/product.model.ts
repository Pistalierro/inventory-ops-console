export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  status: ProductStatus;
  stock: number;
  lowStockThreshold: number;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string;
  updatedBy: string;
}
