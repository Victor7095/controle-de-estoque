import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';

import { NotfoundComponent } from './demo/components/notfound/notfound.component';

import { ProductService } from './demo/service/product.service';
import { IconService } from './demo/service/icon.service';
import { CategoryService } from './demo/service/category.service';
import { AuthService } from './demo/service/auth.service';
import { AuthInterceptor } from './demo/service/auth.interceptor';
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [AppRoutingModule, AppLayoutModule],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        AuthService,
        IconService,
        ProductService,
        CategoryService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        }, {
            provide: 'BASE_API_URL',
            useValue: environment.apiUrl
        }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
