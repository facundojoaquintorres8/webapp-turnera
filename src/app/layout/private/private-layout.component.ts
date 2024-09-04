import { Component } from '@angular/core';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss']
})
export class PrivateLayoutComponent {

  public expandedSidebar: boolean = true;

  constructor() { }
  
  expandSidebar(value: boolean): void {
    this.expandedSidebar = value;
  }

}
