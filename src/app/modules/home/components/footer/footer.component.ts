import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear: string;

  constructor() {}

  ngOnInit(): void {
    this.currentYear = moment().format('DD-MM-YYYY');
  }
}
