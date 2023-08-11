import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/product.service';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    items!: MenuItem[];

    products!: Product[];

    pieData: any;

    pieOptions: any;

    barData: any;

    barOptions: any;

    subscription!: Subscription;

    constructor(
        private productService: ProductService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.initChart();
        this.productService
            .getProductsSmall()
            .then((data) => (this.products = data));

        this.items = [
            { label: 'Add New', icon: 'pi pi-fw pi-plus' },
            { label: 'Remove', icon: 'pi pi-fw pi-minus' },
        ];
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );
        const surfaceBorder =
            documentStyle.getPropertyValue('--surface-border');

        this.pieData = {
            labels: [
                'Eletrônicos',
                'Livros e Mídia',
                'Casa e Decoração',
                'Brinquedos e Jogos',
            ],
            datasets: [
                {
                    data: [540, 325, 702, 444],
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                    ],
                },
            ],
        };

        this.pieOptions = {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor,
                    },
                    position: 'top',
                },
            },
        };

        const labels = [
            'Galaxy A03',
            'TV LG 32',
            'Tablet Samsung Galaxy Tab',
            'Fritadeira Easy Fry',
            'Samsung Galaxy A14',
            'Aquecedor Elétrico',
            'Headset Gamer',
            'Fone de Ouvido Bluetooth',
            'Galaxy Book 2',
            'Ar Condicionado Philco',
        ]
        this.barData = {
            labels: labels,
            datasets: [
                {
                    label: 'Quantidade',
                    data: [100, 80, 70, 65, 50, 45, 40, 35, 30, 25],
                    backgroundColor: [
                        '#0982d1',
                        '#a40033',
                        '#306b67',
                        '#f0f17c',
                        '#79bc1f',
                        '#306b67',
                        '#008f6c',
                        '#01c1ce',
                        '#e40061',
                        '#5e6fff',
                    ],
                    borderWidth: 0,
                    borderRadius: 15,
                    borderSkipped: false,
                },
            ],
        };

        this.barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500,
                        },
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        display: false,
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
            },
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
