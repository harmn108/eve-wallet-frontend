import { Component, Inject, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit{
	menuOpen: boolean;
	active:string;
    logOutSubscription: Subscription;

	constructor(private accountService:AccountService, public router:Router, private tokenService:TokenService){

	}

	ngOnInit(){
			this.tokenService.active.subscribe(
			active => {
				this.active= active;
			}
		);
		this.logOutSubscription = this.accountService.logoutDataChanged.subscribe(data => {
			this.router.navigate(['/user/login']);
		});
	}

	signout() {
		this.accountService.logout();
	}

	settings(){
		this.tokenService.active.next(null);
		this.router.navigate(['/wallet/settings'])
	}

	setActive(active){
		this.router.navigate(['/wallet']);
		this.active = active;
		this.tokenService.active.next(this.active);
	}

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}
}
