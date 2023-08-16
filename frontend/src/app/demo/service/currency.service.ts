import { HttpClient, HttpInterceptor, HttpBackend } from '@angular/common/http';
import { Injectable, InjectionToken, Injector } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HandlerService } from './handler.service';
import { CurrencyResponse } from '../api/currency';

export const HTTP_INTERCEPTORS_CURRENCY = new InjectionToken<HttpInterceptor[]>(
    'HTTP_INTERCEPTORS_CURRENCY'
);

@Injectable()
export class CurrencyService extends HttpClient {
    constructor(backend: HttpBackend, injector: Injector) {
        super(
            new HandlerService(backend, injector, HTTP_INTERCEPTORS_CURRENCY)
        );
    }

    private baseUrl = 'https://economia.awesomeapi.com.br/';

    async getValueUSDtoBRL() {
        const data = await lastValueFrom(
            this.get<CurrencyResponse[]>(`${this.baseUrl}/USD-BRL`)
        );
        return data;
    }
}
