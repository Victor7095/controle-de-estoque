import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/demo/api/category';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { CategoryService } from 'src/app/demo/service/category.service';

@Component({
    templateUrl: './category.component.html',
    providers: [MessageService],
})
export class CategoryComponent implements OnInit {
    categoryDialog: boolean = false;

    deleteCategoryDialog: boolean = false;

    deleteCategoriesDialog: boolean = false;

    categories: Category[] = [];

    category: Category = { name: '' };

    selectedCategories: Category[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private categoryService: CategoryService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.categoryService
            .getCategories()
            .then((data) => (this.categories = data));

        this.cols = [
            { field: 'category', header: 'Category' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' },
        ];
    }

    openNew() {
        this.category = {name: ''};
        this.submitted = false;
        this.categoryDialog = true;
    }

    deleteSelectedCategories() {
        this.deleteCategoriesDialog = true;
    }

    editCategory(category: Category) {
        this.category = { ...category };
        this.categoryDialog = true;
    }

    deleteCategory(category: Category) {
        this.deleteCategoryDialog = true;
        this.category = { ...category };
    }

    confirmDeleteSelected() {
        this.deleteCategoriesDialog = false;
        this.categories = this.categories.filter(
            (val) => !this.selectedCategories.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Categories Deleted',
            life: 3000,
        });
        this.selectedCategories = [];
    }

    confirmDelete() {
        this.deleteCategoryDialog = false;
        this.categories = this.categories.filter(
            (val) => val.id !== this.category.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Category Deleted',
            life: 3000,
        });
        this.category = {name: ''};
    }

    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
    }

    saveCategory() {
        this.submitted = true;

        if (this.category.name?.trim()) {
            if (this.category.id) {
                this.categories[this.findIndexById(this.category.id)] =
                    this.category;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Category Updated',
                    life: 3000,
                });
            } else {
                this.category.id = this.createId();
                this.categories.push(this.category);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Categoria Criada',
                    life: 3000,
                });
            }

            this.categories = [...this.categories];
            this.categoryDialog = false;
            this.category = {name: ''};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
