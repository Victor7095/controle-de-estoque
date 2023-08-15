import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { Product } from 'src/app/demo/api/product';
import { Category } from 'src/app/demo/api/category';
import { ProductService } from 'src/app/demo/service/product.service';
import { CategoryService } from 'src/app/demo/service/category.service';

@Component({
    templateUrl: './product.component.html',
    providers: [MessageService],
})
export class ProductComponent implements OnInit {
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: Product[] = [];

    product: Product = {};

    selectedProducts: Product[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    categories: Category[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.productService
            .getProducts()
            .then((data) => (this.products = data));

        this.cols = [
            { field: 'id', header: 'Código' },
            { field: 'name', header: 'Nome' },
            { field: 'price', header: 'Preço' },
            { field: 'stockQuantity', header: 'Quantidade' },
            { field: 'seller', header: 'Vendedor' },
            { field: 'category', header: 'Categoria' },
        ];

        this.categoryService.getCategories().then((data) => {
            this.categories = data;
        });
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    editProduct(product: Product) {
        this.product = { ...product };
        this.productDialog = true;
    }

    deleteProduct(product: Product) {
        this.deleteProductDialog = true;
        this.product = { ...product };
    }

    confirmDeleteSelected() {
        this.productService
            .deleteSelectedProducts(this.selectedProducts)
            .then(() => {
                this.deleteProductsDialog = false;
                this.products = this.products.filter(
                    (val) => !this.selectedProducts.includes(val)
                );
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Products Deleted',
                    life: 3000,
                });
                this.selectedProducts = [];
            });
    }

    confirmDelete() {
        this.productService.deleteSingleProduct(this.product).then(() => {
            this.deleteProductDialog = false;
            this.products = this.products.filter(
                (val) => val.id !== this.product.id
            );
            this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Deleted',
                life: 3000,
            });
            this.product = {};
        });
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    async saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                await this.productService
                    .updateProduct(this.product)
                    .then(() => {
                        this.products[this.findIndexById(this.product.id)] =
                            this.product;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Produto Atualizado',
                            life: 3000,
                        });
                    });
            } else {
                await this.productService
                    .createProduct(this.product)
                    .then((newProduct: Product) => {
                        this.products.push(newProduct);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Successful',
                            detail: 'Produto Criado',
                            life: 3000,
                        });
                    });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
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
