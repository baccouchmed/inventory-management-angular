import { Component, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  availableLangs: string[];
  /**
   * Constructor
   */
  constructor(private dateAdapter: DateAdapter<any>, private translocoService: TranslocoService) {}

  ngOnInit(): void {
  }
}
