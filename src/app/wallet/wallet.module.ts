import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from "@ngx-translate/core";

import { WalletComponent } from './wallet/wallet.component';
import { WalletInnerComponent } from './wallet-inner/wallet-inner.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule
    ],
    declarations: [
        WalletComponent,
        WalletInnerComponent,
        SettingsComponent,
    ]
})
export class WalletModule {
}
