import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ReallyPostponeDialog } from '../../core/really-postpone/really-postpone.component';
import { AccountService } from '../../core/services/account.service';
import { Router } from '@angular/router';
import { TokenService } from '../../core/services/token.service';


@Component({
  selector: 'app-recovery-first-dialog',
  templateUrl: './recovery-first.component.html',
  styleUrls: ['./recovery-first.component.scss']
})
export class RecoveryFirstComponent implements OnInit{
  brainKey;
  constructor(private tokenService:TokenService, public router:Router, public dialog: MatDialog, private accountService:AccountService) {}
  
  ngOnInit(){
    this.brainKey = this.accountService.brainKey;
    if(!this.brainKey){
      this.router.navigate(['wallet/settings']);
    }
  }

  recover(){
    this.router.navigate(['wallet/backup-recovery-phrase']);
  }
  
  later() {
  	const dialogRef = this.dialog.open(ReallyPostponeDialog, {
  		width: '870px',
  		panelClass: 'wallet-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      }
      else{
        this.accountService.brainKey = '';
        this.router.navigate(['/wallet']);
      }
    });
  }
}
