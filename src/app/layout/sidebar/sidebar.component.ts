import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @Output() expandSidebarEvent: EventEmitter<boolean> = new EventEmitter();

  public expandedSidebar: boolean = true;

  constructor() { }

  ngOnInit(): void {
    this.expandedSidebar = localStorage.getItem('expandedSidebar') ? JSON.parse(localStorage.getItem('expandedSidebar')!) : true;
    this.expandSidebarEvent.emit(this.expandedSidebar);
  }

  expandSidebar(): void {
    this.expandedSidebar = !this.expandedSidebar;
    this.expandSidebarEvent.emit(this.expandedSidebar);
    localStorage.setItem('expandedSidebar', this.expandedSidebar.toString());
  }
}
