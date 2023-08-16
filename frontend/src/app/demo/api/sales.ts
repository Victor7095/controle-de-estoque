import { Product } from './product';

export interface Sale {
    id?: number;
    productId: number;
    product?: Product;
    boughtBy?: {
        id: number;
        username: string;
    };
    observation: string;
    quantity: number;
    createdAt?: Date;
}

export interface SalesCharts {
    lastFourSales: Array<Sale>;
    tenMostSoldProducts: Array<{
        productName: string;
        salesCount: number;
    }>;
    salesGroupedByCategory: Array<{
        categoryName: string;
        salesCount: number;
    }>;
}
