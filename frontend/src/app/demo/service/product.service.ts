import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
        const res = await this.http.get<any>('assets/demo/data/products.json')
            .toPromise();
        const data = res.data as Product[];
        return data;
    }
}
