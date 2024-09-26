import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PrivateLayoutComponent } from './layout/private/private-layout.component';
import { PublicLayoutComponent } from './layout/public/public-layout.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastComponent } from './component/toast/toast.component';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { PermissionModule } from './security/permission.module';
import { AuthGuard } from './security/auth-guard';
import { TokenInterceptor } from './shared/interceptor/token-interceptor';
import { LoadingInterceptor } from './shared/interceptor/loading.interceptor';

const APP_CONTAINERS = [
    PrivateLayoutComponent,
    PublicLayoutComponent
];

registerLocaleData(localeEsAr, 'es');

@NgModule({
    declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        SidebarComponent,
        FooterComponent,
        ToastComponent,
    ],
    exports: [ToastComponent],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        PermissionModule], 
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LoadingInterceptor,
            multi: true
        },
        { provide: LOCALE_ID, useValue: 'es' },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ]
})
export class AppModule { }
