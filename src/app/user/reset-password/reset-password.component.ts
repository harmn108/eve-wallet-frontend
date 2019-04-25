import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Web3Service } from '../../core/services/web3.service';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{
  title = 'reset-password';
  invalidPhrase:boolean = false;
  phraseControl:FormControl = new FormControl('',[Validators.required]);

  constructor(public router:Router, private accountService:AccountService, private web3:Web3Service){

  }

  ngOnInit(){
    this.phraseControl.valueChanges.subscribe(
      () => {
        this.invalidPhrase = false;
      }
    )
  }

  recover(){
    let account = this.web3.backup(this.phraseControl.value);
    if(account){
      this.accountService.recoverAuth(account.publicKey).subscribe(
        (res:any) => {
          this.accountService.stringToSign = res.stringToSign;
          this.accountService.recoverAccount = account;
          this.router.navigate(['/user/create-password'],{queryParams:{recover:true}})
        }
      )
    }
    else{
      this.invalidPhrase = true;
    }
  }
  

}
