import {Routes} from '@angular/router';
import { AuthguardService } from '../core/guards/auth.guard';
import { WalletComponent } from './wallet/wallet.component';


export const walletRoutes: Routes = [
        {
            path: 'wallet',
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    component:WalletComponent
                },
            ],
            canActivateChild: [AuthguardService]
        }
    ]
;
