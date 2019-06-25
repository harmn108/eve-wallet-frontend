import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './core/services/account.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit{
  constructor(private accountService:AccountService, translateService:TranslateService){
    translateService.use('en');
  }

  ngOnInit(){
   
  }

}
