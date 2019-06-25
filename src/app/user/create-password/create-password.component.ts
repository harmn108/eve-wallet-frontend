import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';
import { isPlatformBrowser } from '@angular/common';
import { ErrorService, ErrorEvent } from '../../core/services/error.service';
import { AccountService } from '../../core/services/account.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Web3Service } from '../../core/services/web3.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit{
  loading:boolean = false;
  public passwordForm: FormGroup;
  passType:boolean = false;
  registerSubscription: Subscription;
  errorEventEmiterSubscription: Subscription;
  recovering:boolean = false;
  recoverSubscription:Subscription;

  constructor(private route:ActivatedRoute, private web3:Web3Service, private router: Router,private notificationService:NotificationService, private accountService:AccountService, private errorService: ErrorService,
    @Inject(PLATFORM_ID) private platformId: Object,private FormBuilder: FormBuilder) {
  }

  ngOnInit(){
    this.buildForm();
    if (isPlatformBrowser(this.platformId)) {
      this.passwordForm.valueChanges.subscribe(
        () =>{
          this.passType = false;
        }
      )

      this.route.queryParams.subscribe(
        res => {
          if(res.recover == 'true'){
            this.recovering = true;
          }
        }
      )

      this.errorEventEmiterSubscription = this.errorService.errorEventEmiter.subscribe((data: ErrorEvent) => {
          if (data.action === 'register') {
            this.loading = false;
            this.notificationService.error(data.message);
          }
      });
      this.registerSubscription = this.accountService.registerDataChanged.subscribe(res => {
          this.loading = false;
          this.router.navigate(['/wallet/recovery-phrase']);
      });
      this.recoverSubscription = this.accountService.recoverDataChanged.subscribe(res => {
        this.loading = false;
        this.router.navigate(['/wallet']);
    });
  }
   
  }

  private buildForm() {
    this.passwordForm = this.FormBuilder.group({
      'password': new FormControl('', [Validators.required, ValidationService.passwordValidator]),
      'confirmPassword': new FormControl('', [Validators.required, ValidationService.passwordValidator]),
    }, { validator: ValidationService.passwordsEqualValidator });
  }

  change() {
    if(this.passwordForm.invalid){
      this.passType= true;
      return;
    }
    if(this.recovering){
      this.recover();
      return;
    }
    this.loading = true;
    this.accountService.register(this.passwordForm.value.password);
  }

  recover(){
    this.loading = true;
    this.accountService.recover(this.passwordForm.value.password);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
        this.errorEventEmiterSubscription.unsubscribe();
        this.registerSubscription.unsubscribe();
    }
}
}
