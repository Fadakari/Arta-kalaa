export interface MarketingProduct {
    slug: string;
    [key: string]: any;
}

export interface DiscountInfo {
    discount_percentage: number;
    final_price: number;
}

export interface MarketingCommission {
    id: number;
    [key: string]: any;
}

export interface MarketingProfile {
    id: number;
    [key: string]: any;
}

export interface MarketingStoreItem {
    slug: string;
    [key: string]: any;
    isDiscounted?: boolean;
    discount_percentage?: number;
    final_price?: number;
}

export interface WithdrawalRequestData {
    amount: number;
}