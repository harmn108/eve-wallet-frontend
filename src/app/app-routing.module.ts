import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './core/template/template.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { HomepageComponent } from './core/homepage/homepage.component';
import { userRoutes } from './user/user-routing.module';
import { walletRoutes } from './wallet/wallet-routing.module';
import { LoginComponent } from './user/login/login.component';
import { ExpireLinkComponent } from './shared/expire-link/expire-link';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'user/login'
            },
            ...userRoutes,
            ...walletRoutes
        ]
    },
    {
        path: 'page-not-found',
        pathMatch: 'full',
        component: PageNotFoundComponent
    },
    {
        path: 'expire-link',
        pathMatch: 'full',
        component: ExpireLinkComponent
    },
    {
        path: '**',
        redirectTo: '/page-not-found'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {initialNavigation: 'enabled'})],
    exports: [RouterModule],
    declarations: []
})
export class AppRoutingModule {
}
