// Shop types
export interface Shop {
  id: number;
  name: string;
  description: string;
  address: string;
  phoneNumber: string;
  email?: string;
  logo?: string;
  verifiedBadge: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface ShopProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  videoUrl?: string;
  category: string;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string;
}

export interface ShopWithProducts extends Shop {
  products: ShopProduct[];
}
