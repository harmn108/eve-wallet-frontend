import { Component,OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {
  public loading = false;


  constructor() {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }
}
