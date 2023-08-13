import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Category } from '../api/category';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CategoryService {

    constructor(private http: HttpClient) { }

    async getCategories() {
        const data = await lastValueFrom(this.http.get<Category[]>('categories'));
        return data;
    }

    async createCategory(category: Category) {
        const data = await lastValueFrom(this.http.post<Category>('categories', category));
        return data;
    }

    async updateCategory(category: Category) {
        const data = await lastValueFrom(this.http.put<Category>(`categories/${category.id}`, category));
        return data;
    }

    async deleteSingleCategory(category: Category) {
        const data = await lastValueFrom(this.http.delete<Category>(`categories/${category.id}`));
        return data;
    }

    async deleteSelectedCategories(selectedCategories: Category[]) {
        const ids = selectedCategories.map((category) => category.id);
        const data = await lastValueFrom(this.http.post<Category[]>('categories/delete-multiple', ids));
        return data;
    }
}
