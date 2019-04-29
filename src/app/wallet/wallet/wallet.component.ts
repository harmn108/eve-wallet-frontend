import { Component, Inject, OnInit } from '@angular/core';
import { TokenService } from '../../core/services/token.service';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account.service';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { Web3Service } from '../../core/services/web3.service';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit {
	menuOpen: boolean;
	active: string;
	logOutSubscription: Subscription;
	disabled: boolean = false;
	evegBalance;
	eveoBalance;
	balance;
	ethBalance;
	constructor(private web3:Web3Service, private accountService: AccountService, public router: Router, private tokenService: TokenService) {

	}

	ngOnInit() {
		this.accountService.ethBalance.subscribe(
			eth => {
				this.ethBalance = eth.toString();
			}
		)
			this.tokenService.active.subscribe(
			active => {
				this.active = active;
			}
		);
		this.accountService.getEvegTransactions();
		this.accountService.getEveoTransactions();
		this.accountService.balanceChanged.subscribe(
			res => {
				if(res){
					this.balance = res.balance;
					this.evegBalance = this.balance[environment.eveg_contract_address];
					this.eveoBalance = this.balance[environment.eveo_contract_address];
				}
			}
		)
		this.logOutSubscription = this.accountService.logoutDataChanged.subscribe(data => {
			this.router.navigate(['/user/login']);
		});
	}

	signout() {
		this.accountService.logout();
	}

	settings() {
		this.router.navigate(['/wallet/settings'])
	}

	setActive(active) {
		if (this.disabled) {
			return;
		}
		this.router.navigate(['/wallet']);
		this.active = active;
		this.tokenService.active.next(this.active);
	}

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}

	onactivate(e) {
		if (this.router.url == '/wallet/recovery-phrase' || this.router.url == '/wallet/backup-recovery-phrase') {
			this.active = null;
			this.tokenService.active.next(this.active);
			this.disabled = true;
		}
		if (this.router.url == '/wallet/settings') {
			console.log('here')

			this.active = null;
			this.tokenService.active.next(this.active);
		}
		else {
			this.disabled = false;
		}
	}
}
