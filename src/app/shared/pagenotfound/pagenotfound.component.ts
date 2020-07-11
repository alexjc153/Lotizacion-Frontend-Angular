import { Component, OnInit } from '@angular/core';

declare function init_plugins();

@Component({
  selector: 'app-pagenotfound',
  templateUrl: './pagenotfound.component.html',
  styles: []
})
export class PagenotfoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // tslint:disable-next-line: no-unused-expression
    init_plugins;
  }

}
