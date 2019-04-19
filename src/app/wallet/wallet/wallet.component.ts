import { Component, Inject } from '@angular/core';
import { TokenService } from '../../core/services/token.service';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
	menuOpen: boolean;
	active:string = 'eveg';

	constructor(private tokenService:TokenService){

	}

	signout() {

	}

	setActive(active){
		this.active = active;
		this.tokenService.active.next(this.active);
	}

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}
}
