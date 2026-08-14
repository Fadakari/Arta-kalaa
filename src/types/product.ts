export default interface ProductType {
  quantity: number;
  id: number;
  name: string;
  price: number;
  cover_image: string;
  description_1: string;
  description_2: string;
  category: string;
  stock: number;
  discountPercent?: number;
  slug: string;
  pdfs?: string[];
  images: image[];
  is_available: boolean;
  discount_percentage?: number;
  final_price?: number | null | undefined;
  unit_price?: number;
  isDiscounted?: boolean;
  delivery_price: number;
  color: ProductColor[];
  material: ProductMaterial[];
  discount_price?: null | number
}
export interface ProductColor {
  id: number;
  product: number;
  color_name: string;
  color_code: string;
  price: number;
  stock: number;
  image: string | null;
  image_url: string | null;
}

export interface ProductMaterial {
  id: number;
  product: number;
  material_name: string;
  price: number;
  stock: number;
}

interface image {
  order: number;
  id: string;
  image: string
}