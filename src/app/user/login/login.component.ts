import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorEvent } from '../../core/services/error.service';
import { NotificationService } from '../../core/services/notification.service';
import { AccountService } from '../../core/services/account.service';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title:string = 'login';
  public loginForm: FormGroup;
  loading:boolean = false;
  loginType: boolean = false;
  authenticateSubscription: Subscription;
  loginSubscription: Subscription;
  errorEventEmiterSubscription: Subscription;
  errorMessage:string = '';
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService:TranslateService, private accountService:AccountService, private notificationService:NotificationService, private FormBuilder: FormBuilder, private errorService:ErrorService) {
    this.buildForm();
  }

  ngOnInit() {
    this.loginForm.valueChanges.subscribe(
      () => {
        this.loginType = false;
      }
    )

    this.errorEventEmiterSubscription = this.errorService.errorEventEmiter.subscribe((data: ErrorEvent) => {
      if (data.action === 'login' || data.action === 'authenticate') {
        this.loading = false;
        this.errorMessage = this.translateService.instant(data.message)
        this.notificationService.error(data.message);
      }
    });

    this.authenticateSubscription = this.accountService.authenticateDataChanged.subscribe(auth => {
      this.accountService.login(this.loginForm.value.email, this.loginForm.value.password, auth);
    });

    this.loginSubscription = this.accountService.loginDataChanged.subscribe(user => {
      this.loading = false;
    });
  }

  private buildForm() {
    this.loginForm = this.FormBuilder.group({
      'email': new FormControl('', [Validators.required, ValidationService.emailValidator]),
      'password': new FormControl('', [Validators.required, , ValidationService.passwordValidator])
    });
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginType = true;
      return
    }
    this.loading = true;
    this.accountService.authenticate(this.loginForm.value.email);

  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
        this.errorEventEmiterSubscription && this.errorEventEmiterSubscription.unsubscribe();
        this.authenticateSubscription && this.authenticateSubscription.unsubscribe();
        this.loginSubscription && this.loginSubscription.unsubscribe();
    }
}

}
