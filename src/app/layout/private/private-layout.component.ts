import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.scss']
})
export class PrivateLayoutComponent implements OnInit {

  public expandedSidebar: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.expandedSidebar = localStorage.getItem('expandedSidebar') ? JSON.parse(localStorage.getItem('expandedSidebar')!) : true;
  }

  expandSidebar(): void {
    this.expandedSidebar = !this.expandedSidebar;
    localStorage.setItem('expandedSidebar', this.expandedSidebar.toString());
  }

}
