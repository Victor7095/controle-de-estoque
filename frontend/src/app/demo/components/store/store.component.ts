import { Component } from '@angular/core';
import { ProductService } from '../../service/product.service';
import { MessageService } from 'primeng/api';
import { Product } from '../../api/product';
import { CurrencyService } from '../../service/currency.service';
import { Category } from '../../api/category';
import { CategoryService } from '../../service/category.service';

@Component({
    templateUrl: './store.component.html',
    providers: [MessageService],
})
export class StoreComponent {
    products: Product[];
    usdToBrl: number = 1;

    selectedCategoryId?: number;
    categories: Category[];

    searchValue: string = "";

    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
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
            }
        );
    }
}
