import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';
import { Subscription } from 'rxjs';
import { ErrorService, ErrorEvent } from '../../core/services/error.service';
import { NotificationService } from '../../core/services/notification.service';
import { AccountService } from '../../core/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  loginType: boolean = false;
  authenticateSubscription: Subscription;
  loginSubscription: Subscription;
  errorEventEmiterSubscription: Subscription;

  constructor(private accountService:AccountService, private notificationService:NotificationService, private FormBuilder: FormBuilder, private errorService:ErrorService) {
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
        this.notificationService.error(data.message);
      }
    });

    this.authenticateSubscription = this.accountService.authenticateDataChanged.subscribe(auth => {
      this.accountService.login(this.loginForm.value.email, this.loginForm.value.password, auth);
    });

    this.loginSubscription = this.accountService.loginDataChanged.subscribe(user => {
      
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

  }

}
