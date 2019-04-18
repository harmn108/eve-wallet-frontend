import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';



@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        TranslateModule
    ],
    declarations: [
        UserComponent,
        LoginComponent,
        RegisterComponent,
        CreatePasswordComponent
    ]
})
export class UserModule {
}
