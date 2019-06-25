import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { RecoveryFirstComponent } from '../../wallet/recovery-first/recovery-first.component';

@Component({
  selector: 'app-really-postpone-dialog',
  templateUrl: './really-postpone.component.html',
  styleUrls: ['./really-postpone.component.scss']
})
export class ReallyPostponeDialog {
    constructor(private dialogRef: MatDialogRef<RecoveryFirstComponent>){

    }

    close(bool){
      this.dialogRef.close(bool);
    }
}
