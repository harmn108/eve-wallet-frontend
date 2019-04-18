import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginCheckGuardService } from '../core/guards/login-check.guard';
import { UserComponent } from './user.component';

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
                    path: 'reset-password',
                    pathMatch: 'full',
                    component: ResetPasswordComponent,
                  //  canActivate: [LoginCheckGuardService]
                },
            ]
        }
    ]
;
