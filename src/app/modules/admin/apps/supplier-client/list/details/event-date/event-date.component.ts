import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-event-date',
  templateUrl: './event-date.component.html',
  styleUrls: ['./event-date.component.scss'],
})
export class EventDateComponent {
  date: Date;
  constructor(
    public dialogRef: MatDialogRef<EventDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  addEvent() {
    this.dialogRef.close(this.date);
  }
}
