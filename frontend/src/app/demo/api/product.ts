import { Category } from './category';
import { User } from './user';

export interface Product {
    id?: number;
    name?: string;
    sellerId?: number;
    seller?: User;
    price?: number;
    stockQuantity?: number;
    categoryId?: number;
    category?: Category;
}
