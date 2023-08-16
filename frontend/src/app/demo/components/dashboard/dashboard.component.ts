import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { SalesService } from '../../service/sales.service';
import { Sale, SalesCharts } from '../../api/sales';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
    chartsData!: SalesCharts;

    lastFourSales: Sale[];

    pieData: any;
    pieOptions: any;

    barData: any;
    barOptions: any;

    subscription!: Subscription;

    constructor(
        private salesService: SalesService,
        public layoutService: LayoutService
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(() => {
        });
    }

    ngOnInit() {
        this.salesService.getCharts().then((chartsData) => {
            this.chartsData = chartsData;
            this.lastFourSales = this.chartsData.lastFourSales;
            this.initChart();
        });
    }

    extractSalesGroupedByCategory() {
        const salesGroupedByCategory = this.chartsData.salesGroupedByCategory;
        // Only first 3 and resr grouped as 'Others'
        const labels = salesGroupedByCategory
            .map((item) => item.categoryName)
            .slice(0, 3);
        const data = salesGroupedByCategory
            .map((item) => item.salesCount)
            .slice(0, 3);
        labels.push('Outros');
        data.push(
            salesGroupedByCategory
                .map((item) => item.salesCount)
                .slice(3)
                .reduce((a, b) => a + b, 0)
        );

        
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        this.pieData = {
            labels,
            datasets: [
                {
                    data,
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
    }

    extractTenMostSoldProducts() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue(
            '--text-color-secondary'
        );

        const tenMostSoldProducts = this.chartsData.tenMostSoldProducts;
        const labels = tenMostSoldProducts.map((item) => item.productName);
        const data = tenMostSoldProducts.map((item) => item.salesCount);

        this.barData = {
            labels,
            datasets: [
                {
                    label: 'Quantidade',
                    data,
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

    initChart() {
        this.extractSalesGroupedByCategory();
        this.extractTenMostSoldProducts();
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
