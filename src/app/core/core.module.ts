import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { HomepageComponent } from './homepage/homepage.component';
import { TemplateComponent } from './template/template.component';
import { PrivateKeyDialog } from './private-key/private-key.component';
import { RecoveryPhraseDialog } from './recovery-phrase/recovery-phrase.component';
import { ConfirmTransactionDialog } from './confirm-transaction/confirm-transaction.component';
import { ReallyPostponeDialog } from './really-postpone/really-postpone.component';
import { AuthguardService } from './guards/auth.guard';
import { LoginCheckGuardService } from './guards/login-check.guard';
import { UserModule } from '../user/user.module';

export function createTranslateLoader(http: HttpClient) {
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        UserModule,
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
        ConfirmTransactionDialog,
        PrivateKeyDialog,
        RecoveryPhraseDialog,
        ReallyPostponeDialog,
        // HeaderComponent,
        // FooterComponent,
    ],
    providers: [
        // AuthguardService,
        // AccountService,
        // NotificationService,
        // ErrorService
        AuthguardService,
        LoginCheckGuardService,
    ],
    // exports: [SafePipe, SharedModule],
    entryComponents: [
        ConfirmTransactionDialog,
        PrivateKeyDialog,
        RecoveryPhraseDialog,
        ReallyPostponeDialog,
    ]
})
export class CoreModule {
}
