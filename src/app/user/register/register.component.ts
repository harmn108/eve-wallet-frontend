import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';
import { AccountService } from '../../core/services/account.service';
import { isPlatformBrowser } from '@angular/common';
import { ErrorService, ErrorEvent } from '../../core/services/error.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  title: string = 'register';
  emailType: boolean = false;
  emailControl = new FormControl('', [Validators.required, ValidationService.emailValidator]);
  request: boolean = false;
  loading:boolean = false;
  preRegisterSubscription: Subscription;
  errorEventEmiterSubscription: Subscription;
  errorMessage:string = '';
  constructor(private errorService: ErrorService,
    @Inject(PLATFORM_ID) private platformId: Object, private accountService: AccountService) {

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.emailControl.valueChanges.subscribe(
        () => {
          this.emailType = false;
        }
      )
    }
 

    this.errorEventEmiterSubscription = this.errorService.errorEventEmiter.subscribe((data: ErrorEvent) => {
      if (data.action === 'preRegister') {
        this.loading = false;
        this.errorMessage = data.message;
      }
    });

    this.preRegisterSubscription = this.accountService.preRegisterDataChanged.subscribe(() => {
      this.loading = false;
      this.request = true;
    });
  }

  requestEmail() {
    if (this.emailControl.invalid) {
      this.emailType = true;
      return
    }
    this.errorMessage = '';
    this.loading = true;
    this.accountService.preRegister(this.emailControl.value);
  }

  check(){
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      this.preRegisterSubscription && this.preRegisterSubscription.unsubscribe();
      this.errorEventEmiterSubscription && this.errorEventEmiterSubscription.unsubscribe();
    }
  }

}
