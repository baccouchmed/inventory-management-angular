import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  routerActive: number;
  constructor(public router: Router) {}

  ngOnInit(): void {
    this.getRoute();
  }
  getRoute() {
    switch (this.router.url) {
      case '/home':
        this.routerActive = 1;
        console.log(this.routerActive);
        break;
      case '/home/docs':
        this.routerActive = 2;
        console.log(this.routerActive);
        break;
      case '/home/pricing':
        this.routerActive = 3;
        console.log(this.routerActive);
        break;
      default:
        break;
    }
  }
}
