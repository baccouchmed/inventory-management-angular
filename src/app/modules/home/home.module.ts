import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { homeRoutes } from './home.routing';
import { HomeComponent } from './home.component';
import { FuseCardModule } from '../../../@fuse/components/card';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { StartComponent } from './components/start/start.component';
import { DocsComponent } from './components/docs/docs.component';
import { PricingComponent } from './components/pricing/pricing.component';

@NgModule({
  declarations: [
    HomeComponent,
    PricingComponent,
    HeaderComponent,
    FooterComponent,
    StartComponent,
    DocsComponent,
  ],
  imports: [
    RouterModule.forChild(homeRoutes),
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    FuseAlertModule,
    FuseCardModule,
    SharedModule,
    MatSelectFilterModule,
    MatProgressBarModule,
  ],
})
export class HomeModule {}
