export interface User {
    identity: {
        phone_number: string;
        first_name: string | null;
        last_name: string | null;
        national_code: string | null;
        email: string | null;
        job: string | null;
        address: string | null;
        postal_code: string | null;
        birth_date: string | null;
        province: string | null;
        city: string | null;
        referral_code: string;
        points: number;
    };
    cart: {
        message: string;
        items: any[];
    };
    pre_invoices: {
        message: string;
    };
    orders: {
        message?: string;
        
    };
}
export type OrderItem = {
    id: number;
    order_number: string;
    amount: string;
    status: "pending" | "paid" | "canceled" | string;
    city: string;
    date: string;
};      