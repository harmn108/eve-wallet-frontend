import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ConfirmTransactionDialog } from '../../core/confirm-transaction/confirm-transaction.component';


@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
	constructor(public dialog: MatDialog) {}

  generateTransaction() {
  	const dialogRef = this.dialog.open(ConfirmTransactionDialog, {
  		width: '870px',
  		panelClass: 'confirm-transaction-dialog'
  	});
  }
}
