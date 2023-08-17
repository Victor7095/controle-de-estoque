import { Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { CurrencyService } from '../../service/currency.service';
import { Category } from '../../api/category';
import { CategoryService } from '../../service/category.service';
import { SalesService } from '../../service/sales.service';
import { Sale } from '../../api/sales';

@Component({
    templateUrl: './store.component.html',
    providers: [MessageService],
})
export class StoreComponent {
    products: Product[];
    usdToBrl: number = 1;

    selectedCategoryId?: number;
    categories: Category[];

    searchValue: string = '';

    selectedProduct: Product;
    quantityToBuy: number = 1;
    observation: string = '';

    showBuyDialog: boolean = false;
    submitted: boolean = false;

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
        private salesService: SalesService,
        private currencyService: CurrencyService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.productService.getProductsInStore(null, null).then((data) => {
            this.products = data;
        });
        this.currencyService.getValueUSDtoBRL().then((data) => {
            this.usdToBrl = Number(data[0].bid);
        });
        this.categoryService.getCategories().then((data) => {
            this.categories = data;
        });
    }

    onSearchChange(searchText: string) {
        console.log(this.selectedCategoryId, searchText);
        this.productService
            .getProductsInStore(this.selectedCategoryId, searchText)
            .then((data) => {
                this.products = data;
            });
    }

    onCategoryChange(categoryId: number) {
        console.log(categoryId, this.searchValue);
        this.productService
            .getProductsInStore(categoryId, this.searchValue)
            .then((data) => {
                this.products = data;
            });
    }

    buyProduct(product: Product) {
        this.selectedProduct = product;
        this.showBuyDialog = true;
    }

    confirmBuy() {
        this.submitted = true;
        const data: Sale = {
            productId: this.selectedProduct.id,
            quantity: this.quantityToBuy,
            observation: this.observation,
        };
        this.salesService
            .buyProduct(data)
            .then((data) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Product bought successfully',
                });
                this.hideDialog();
            })
            .catch((error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Error buying product',
                });
            });
    }

    hideDialog() {
        this.showBuyDialog = false;
        this.submitted = false;
        this.selectedProduct = null;
        this.quantityToBuy = 1;
        this.observation = '';
    }
}
