import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { WalletInnerComponent } from '../../wallet/wallet-inner/wallet-inner.component'

@Component({
  selector: 'app-confirm-transaction-dialog',
  templateUrl: './confirm-transaction.component.html',
  styleUrls: ['./confirm-transaction.component.scss']
})
export class ConfirmTransactionDialog {
  constructor(private dialogRef: MatDialogRef<WalletInnerComponent>) {

  }

  close() {
  	this.dialogRef.close();
  }
}
