import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from "@ngx-translate/core";

import { WalletComponent } from './wallet/wallet.component';
import { WalletInnerComponent } from './wallet-inner/wallet-inner.component';
import { SettingsComponent } from './settings/settings.component';
import { RecoveryPhraseWordsComponent } from './recovery-phrase-words/recovery-phrase-words.component';
import { RecoveryFirstComponent } from './recovery-first/recovery-first.component';

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule,
        MatTooltipModule
    ],
    declarations: [
        WalletComponent,
        WalletInnerComponent,
        SettingsComponent,
        RecoveryPhraseWordsComponent,
        RecoveryFirstComponent,
    ]
})
export class WalletModule {
}
