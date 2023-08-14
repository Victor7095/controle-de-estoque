import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Product } from '../api/product';

@Injectable()
export class ProductService {

    constructor(private http: HttpClient) { }

    async getProductsSmall() {
        const res = await this.http.get<any>('assets/demo/data/products-small.json')
            .toPromise();
        const data = res.data as Product[];
        return data;
    }

    async getProducts() {
        const data = await lastValueFrom(this.http.get<Product[]>('products'));
        return data;
    }

    async createProduct(product: Product) {
        const data = await lastValueFrom(this.http.post<Product>('products', product));
        return data;
    }

    async updateProduct(product: Product) {
        const data = await lastValueFrom(this.http.put<Product>(`products/${product.id}`, product));
        return data;
    }

    async deleteSingleProduct(product: Product) {
        const data = await lastValueFrom(this.http.delete<Product>(`products/${product.id}`));
        return data;
    }

    async deleteSelectedProducts(selectedProducts: Product[]) {
        const ids = selectedProducts.map((product) => product.id);
        const data = await lastValueFrom(this.http.post<Product[]>('products/delete-multiple', ids));
        return data;
    }
}
