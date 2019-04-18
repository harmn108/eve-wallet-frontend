import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit, OnDestroy {
    public loading = false;

    constructor(private router: Router,
                public translateService: TranslateService) {
    }

    ngOnInit() {
        this.translateService.use('en');
    }

    public changeLang(lang: string) {
        this.translateService.use(lang);
    }

    ngOnDestroy() {}
}



