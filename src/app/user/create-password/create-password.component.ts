import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ValidationService } from '../../core/services/validation.service';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit{
  public passwordForm: FormGroup;
  passType:boolean = false;
  constructor(private FormBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit(){
    this.passwordForm.valueChanges.subscribe(
      () =>{
        this.passType = false;
      }
    )
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
  }
}
