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
        this.categoryService.getCategories().then((data) => {
            this.categories = data;
        });

        this.cols = [
            { field: 'id', header: 'Código' },
            { field: 'name', header: 'Nome' },
        ];
    }

    openNew() {
        this.category = { name: '' };
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
        this.categoryService
            .deleteSelectedCategories(this.selectedCategories)
            .then(() => {
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
            });
    }

    confirmDelete() {
        this.categoryService.deleteSingleCategory(this.category).then(() => {
            this.categories = this.categories.filter(
                (val) => val.id !== this.category.id
            );
            this.category = { name: '' };
            this.deleteCategoryDialog = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Category Deleted',
                life: 3000,
            });
        });
    }

    hideDialog() {
        this.categoryDialog = false;
        this.submitted = false;
    }

    async saveCategory() {
        this.submitted = true;

        if (this.category.name?.trim()) {
            if (this.category.id) {
                await this.categoryService.updateCategory(this.category).then(() => {
                    this.categories[this.findIndexById(this.category.id)] =
                        this.category;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Successful',
                        detail: 'Categoria Atualizada',
                        life: 3000,
                    });
                });
            } else {
                await this.categoryService.createCategory(this.category).then((data) => {
                    this.categories.push(data);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Categoria Criada',
                        life: 3000,
                    });
                });
            }

            this.categories = [...this.categories];
            this.categoryDialog = false;
            this.category = { name: '' };
        }
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.categories.length; i++) {
            if (this.categories[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }
}
