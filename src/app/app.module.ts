import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PrivateLayoutComponent } from './layout/private/private-layout.component';
import { PublicLayoutComponent } from './layout/public/public-layout.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TokenInterceptor } from './security/token-interceptor';
import { ToastComponent } from './component/toast/toast.component';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { PermissionModule } from './security/permission.module';
import { AuthGuard } from './security/auth-guard';

const APP_CONTAINERS = [
  PrivateLayoutComponent,
  PublicLayoutComponent
];

registerLocaleData(localeEsAr, 'es');

@NgModule({ declarations: [
        AppComponent,
        ...APP_CONTAINERS,
        NavbarComponent,
        FooterComponent,
        ToastComponent,
    ],
    exports: [ToastComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        PermissionModule], providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        },
        { provide: LOCALE_ID, useValue: 'es' },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule {}
