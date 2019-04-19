import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RegisterConfirmationComponent } from './register-confirmation/register-confirmation.component';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
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
        UserComponent,
        LoginComponent,
        RegisterComponent,
        CreatePasswordComponent,
        RegisterConfirmationComponent,
        ResetPasswordComponent
    ]
})
export class UserModule {
}
