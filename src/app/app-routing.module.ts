import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './core/template/template.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { HomepageComponent } from './core/homepage/homepage.component';

const routes: Routes = [
    {
        path: '',
        component: TemplateComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                component: HomepageComponent
            },
        ]
    },
    {
        path: 'page-not-found',
        pathMatch: 'full',
        component: PageNotFoundComponent
    },
    {
        path: ':lang',
        component: TemplateComponent,
        // canActivateChild: [LanguageGuard],
        children: [
            {
                path: '**',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
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
