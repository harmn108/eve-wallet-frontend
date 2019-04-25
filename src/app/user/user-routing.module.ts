import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginCheckGuardService } from '../core/guards/login-check.guard';
import { UserComponent } from './user.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';
import { AccountCheckGuard } from '../core/guards/account-check.guard';

export const userRoutes: Routes = [
        {
            path: 'user',
            component:UserComponent,
            children: [
                {
                    path: '',
                    pathMatch: 'full',
                    redirectTo: '/page-not-found'
                },
                {
                    path: 'login',
                    pathMatch: 'full',
                    component: LoginComponent,
                  //  canActivate: [LoginCheckGuardService]
                },
                {
                    path: 'register',
                    pathMatch: 'full',
                    component: RegisterComponent,
                  //  canActivate: [LoginCheckGuardService]
                },
                {
                    path: 'create-password',
                    pathMatch: 'full',
                    component: CreatePasswordComponent,
                    canActivate:[AccountCheckGuard]
                },
                {
                    path: 'confirmation/:code',
                    pathMatch: 'full',
                    component: RegisterConfirmationComponent,
                },
                {
                    path: 'reset-password',
                    pathMatch: 'full',
                    component: ResetPasswordComponent,
                  //  canActivate: [LoginCheckGuardService]
                },
            ]
        }
    ]
;
