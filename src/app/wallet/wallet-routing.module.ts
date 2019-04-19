import { Routes } from '@angular/router';
import { AuthguardService } from '../core/guards/auth.guard';
import { WalletComponent } from './wallet/wallet.component';
import { WalletInnerComponent } from './wallet-inner/wallet-inner.component';
import { SettingsComponent } from './settings/settings.component';
import { RecoveryPhraseWordsComponent } from './recovery-phrase-words/recovery-phrase-words.component';
import { RecoveryFirstComponent } from './recovery-first/recovery-first.component';

export const walletRoutes: Routes = [
        {
            path: 'wallet',
            component: WalletComponent,
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    component: WalletInnerComponent
                },
                {
                    path: 'settings',
                    pathMatch: 'full',
                    component: SettingsComponent
                },
                {
                    path: 'backup-recovery-phrase',
                    pathMatch: 'full',
                    component: RecoveryPhraseWordsComponent
                },
                {
                    path: 'recovery-phrase',
                    pathMatch: 'full',
                    component: RecoveryFirstComponent
                }
            ],
            canActivateChild: [AuthguardService]
        }
    ]
;
