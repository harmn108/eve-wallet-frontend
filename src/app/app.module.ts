import { BrowserModule } from '@angular/platform-browser';
import { APP_ID, Inject, NgModule, PLATFORM_ID } from '@angular/core';

import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { isPlatformBrowser } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { AccountService } from './core/services/account.service';
import { NotificationService } from './core/services/notification.service';
import { ErrorService } from './core/services/error.service';
import { WalletModule } from './wallet/wallet.module';
import { Web3Service } from './core/services/web3.service';
import { CryptService } from './core/services/crypt.service';
import { TokenService } from './core/services/token.service';
import {MatSliderModule} from '@angular/material/slider';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'eve-wallet-frontend-app'}),
    BrowserAnimationsModule,
    AppRoutingModule,
    CoreModule,
    TransferHttpCacheModule,
    UserModule,
    WalletModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    TranslateService,
    AccountService,
    NotificationService,
    ErrorService,
    Web3Service,
    CryptService,
    TokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId,
    @Inject(APP_ID) private appId: string
  ) {
    const platform = isPlatformBrowser(platformId)
      ? 'in the browser'
      : 'on the server';
  }
}
