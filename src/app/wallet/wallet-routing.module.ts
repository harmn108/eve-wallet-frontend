import { Routes } from '@angular/router';
import { AuthguardService } from '../core/guards/auth.guard';
import { WalletComponent } from './wallet/wallet.component';
import { WalletInnerComponent } from './wallet-inner/wallet-inner.component';
import { SettingsComponent } from './settings/settings.component';


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
            ],
           // canActivateChild: [AuthguardService]
        }
    ]
;
