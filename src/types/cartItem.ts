export type CartItem = {
    id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        price: number;
        cover_image: string | null;
        category: string;
        is_available: boolean;
        discount_price: number | null;
    };
    color_variant: {
        id: number;
        product: number;
        color_name: string;
        color_code: string;
        price: number;
        stock: number;
        image: string | null;
        image_url: string | null;
    } | null;
    material_variant: {
        id: number;
        product: number;
        material_name: string;
        price: number;
        stock: number;
    } | null;
    quantity: number;
    unit_price: number;
    delivery_price: number;
    total_price: number;
    total_delivery: number;
    full_total: number;
};
