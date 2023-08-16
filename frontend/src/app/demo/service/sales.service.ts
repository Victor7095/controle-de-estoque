import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Product } from '../api/product';
import { Sale, SalesCharts } from '../api/sales';

@Injectable()
export class SalesService {
    constructor(private http: HttpClient) {}

    async getCharts() {
        const data = await lastValueFrom(
            this.http.get<SalesCharts>('sales/charts')
        );
        return data;
    }

    async buyProduct(sale: Sale) {
        const data = await lastValueFrom(
            this.http.post<Product>('sales/buy-product', sale)
        );
        return data;
    }
}
