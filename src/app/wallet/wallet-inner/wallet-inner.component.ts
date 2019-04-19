import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmTransactionDialog } from '../../core/confirm-transaction/confirm-transaction.component';
import { TokenService } from '../../core/services/token.service';
import { AccountService } from '../../core/services/account.service';


@Component({
  selector: 'app-wallet-inner',
  templateUrl: './wallet-inner.component.html',
  styleUrls: ['./wallet-inner.component.scss']
})
export class WalletInnerComponent implements OnInit{
  token:string = 'eveg';
  address:string;
	constructor(private accountService:AccountService, public dialog: MatDialog, private tokenService:TokenService) {
   
  }

  ngOnInit(){
    this.tokenService.active.subscribe(
      token => {
        this.token = token;
      }
    );
      this.address = this.accountService.accountInfo.address;
  }

  generateTransaction() {
  	const dialogRef = this.dialog.open(ConfirmTransactionDialog, {
  		width: '870px',
  		panelClass: 'wallet-dialog'
  	});
  }
}
