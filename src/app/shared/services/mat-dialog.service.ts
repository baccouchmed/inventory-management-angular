import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class MatDialogService {
  dialogRef: MatDialogRef<any>;
  constructor(private dialog: MatDialog) {}

  openDialog(component: ComponentType<any>, data?: any): MatDialogRef<any> {
    this.dialogRef = this.dialog.open(component, { data });
    return this.dialogRef;
  }
}
