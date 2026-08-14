// تایپ‌های عمومی
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    status: number;
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  export interface DiscountInfo {
    isDiscounted: boolean;
    discount_percentage?: number;
    final_price?: number;
  }
  
  // تایپ‌های محصول
  export interface GetProductsParams {
    category_id?: number;
    min_price?: number;
    max_price?: number;
    is_available?: boolean;
    is_featured?: boolean;
    search?: string;
    new_days?: number;
    sort?: string;
    page?: number;
  }
  
  export interface CartItem {
    product_id: number;
    quantity: number;
    is_discounted?: boolean;
    store_name_english?: string;
    color_id?: number | null;
    material_id?: number | null;
  }
  
  export interface CartResponse {
    total_items: number;
    total_quantity: number;
    total_price: number;
    items: any[];
  }
  
  export interface CommentData {
    text: string;
    parent?: number | null;
  }
  
  export interface OrderData {
    // تعریف فیلدهای سفارش
    [key: string]: any;
  }