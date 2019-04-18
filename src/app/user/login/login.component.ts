import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  public loginForm: FormGroup;
  loginType:boolean = false;

  constructor(private FormBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit(){
    this.loginForm.valueChanges.subscribe(
      () =>{
        this.loginType = false;
      }
    )
  }

  private buildForm() {
    this.loginForm = this.FormBuilder.group({
      'email': new FormControl('', [Validators.required, ValidationService.emailValidator]),
      'password': new FormControl('', [Validators.required,, ValidationService.passwordValidator])
    });
  }

  login(){
    if(this.loginForm.invalid){
      this.loginType= true;
      return
    }
    
  }

}
