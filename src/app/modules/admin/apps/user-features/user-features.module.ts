import { NgModule } from '@angular/core';
import { groupsRoutes } from './user-features-routing';
import { ListComponent } from './list/list.component';
import { RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../../shared/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseFindByKeyPipeModule } from '../../../../../@fuse/pipes/find-by-key';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TranslocoRootModule } from '../../../../transloco/transloco-root.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { UserFeaturesComponent } from './user-features.component';
import { AddComponent } from './add/add.component';
import { DetailsComponent } from './list/components/details/details.component';
import { EditComponent } from './list/components/edit/edit.component';

@NgModule({
  declarations: [
    UserFeaturesComponent,
    AddComponent,
    ListComponent,
    DetailsComponent,
    EditComponent,
  ],
  imports: [
    RouterModule.forChild(groupsRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMomentDateModule,
    MatProgressBarModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatTableModule,
    MatTooltipModule,
    FuseFindByKeyPipeModule,
    SharedModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatAutocompleteModule,
    NgApexchartsModule,
    TranslocoRootModule,
    MatTabsModule,
    DragDropModule,
    MatSelectFilterModule,
    ClipboardModule,
  ],
})
export class UserFeaturesModule {}
