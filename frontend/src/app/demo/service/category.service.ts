import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../api/category';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) { }

    async getCategories() {
        const res = await lastValueFrom(this.http.get<any>('assets/demo/data/categories.json'));
        const data = res.data as Category[];
        return data;
    }
}
