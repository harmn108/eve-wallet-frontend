import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WalletComponent} from './wallet/wallet.component';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule
    ],
    declarations: [
        WalletComponent
    ]
})
export class WalletModule {
}
