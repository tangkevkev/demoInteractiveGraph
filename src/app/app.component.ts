import { Component, OnChanges, OnInit } from '@angular/core';
import { InteractiveGraph, GraphType, InteractiveGraphService } from 'interactive-graph'
import { Router, RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnChanges {
  router: Router;

  constructor(router: Router) {
    this.router = router;
  }


  ngOnChanges() {
    console.log("CHANNNGE")
  }

  customLink: boolean = false;

  currentLink() {
    this.customLink = !this.customLink
  }


}
