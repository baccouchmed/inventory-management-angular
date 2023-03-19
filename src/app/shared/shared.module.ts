import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FuseCardModule } from '@fuse/components/card';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RefListPipe } from './pipes/refList/ref-list.pipe';
import { StatusFormatPipe } from './pipes/statusFormat/status-format.pipe';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';
import { FileFormatPipe } from './pipes/fileFormat/file-format.pipe';
import { FeaturesDirective } from './directives/features/features.directive';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FuseCardModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    RefListPipe,
    StatusFormatPipe,
    SnackBarComponent,
    FileFormatPipe,
    FeaturesDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RefListPipe,
    StatusFormatPipe,
    FuseCardModule,
    MatDatepickerModule,
    NgxMaterialTimepickerModule,
    MatNativeDateModule,
    SnackBarComponent,
    MatSnackBarModule,
    FileFormatPipe,
    FeaturesDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
