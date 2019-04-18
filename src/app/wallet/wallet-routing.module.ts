import {Routes} from '@angular/router';
import { AuthguardService } from '../core/guards/auth.guard';


export const walletRoutes: Routes = [
        {
            path: 'wallet',
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: '/page-not-found'
                },
            ],
            canActivateChild: [AuthguardService]
        }
    ]
;
