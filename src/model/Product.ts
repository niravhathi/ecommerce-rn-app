// src/models/Product.ts

export interface Category {
  id?: number;
  name: string;
  slug: string;
  url: string;
  // image: string;
  // creationAt: string;
  // updatedAt: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  slug?: string; // Optional if not provided by new JSON
  price: number;
  description: string;
  category: string; // Changed to support "category": "beauty" string fallback
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: Dimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Review[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: Meta;
  images: string[];
  thumbnail?: string;
  creationAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Product {
  quantity?: number;
}
