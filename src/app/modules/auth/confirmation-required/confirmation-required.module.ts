import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { AuthConfirmationRequiredComponent } from 'app/modules/auth/confirmation-required/confirmation-required.component';
import { authConfirmationRequiredRoutes } from 'app/modules/auth/confirmation-required/confirmation-required.routing';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CodeInputModule } from 'angular-code-input';
import { FuseAlertModule } from '../../../../@fuse/components/alert';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [AuthConfirmationRequiredComponent],
  imports: [
    RouterModule.forChild(authConfirmationRequiredRoutes),
    MatButtonModule,
    FuseCardModule,
    SharedModule,
    MatRadioModule,
    FuseAlertModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    CodeInputModule,
    TranslocoModule,
  ],
})
export class AuthConfirmationRequiredModule {}
