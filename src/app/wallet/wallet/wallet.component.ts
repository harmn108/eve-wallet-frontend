import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent {
	menuOpen: boolean;

	signout() {

	}

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
	}
}
