import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { HomepageComponent } from './homepage/homepage.component';
import { TemplateComponent } from './template/template.component';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    declarations: [
        HomepageComponent,
        TemplateComponent,
        // HeaderComponent,
        // FooterComponent,
    ],
    providers: [
        // AuthguardService,
        // AccountService,
        // NotificationService,
        // ErrorService
    ],
    // exports: [SafePipe, SharedModule],
    entryComponents: [
    ]
})
export class CoreModule {
}
