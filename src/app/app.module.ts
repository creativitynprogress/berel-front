import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LOCALE_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { Http, RequestOptions } from '@angular/http';
import { AuthenticationService } from './_services/authentication.service';
import { routing } from './router';
import { LoginComponent } from './LoginComponent/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from './_guards/auth.guard';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { CurrencyPipe } from '@angular/common';
import { AdminGuard } from './_guards/admin.guard';
import { PaintService } from './_services/paint.service';
import { LineService } from './_services/line.service';

import { SnotifyModule, SnotifyService, ToastDefaults } from 'ng-snotify';
import { PreloadAllModules } from '@angular/router';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'BEARER',
    globalHeaders: [{ 'Content-Type': 'application/json' }]
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    SnotifyModule
  ],
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    {provide: LOCALE_ID, useValue: 'es-MX' },
    AuthGuard,
    AdminGuard,
    AuthenticationService,
    PaintService,
    LineService,
    CurrencyPipe,
    { provide: 'SnotifyToastConfig', useValue: ToastDefaults},
    SnotifyService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
