import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SharedModule } from 'app/shared/shared.module';
import { TranslocoModule } from '@ngneat/transloco';
import { LanguagesSigninComponent } from './languages-signin.component';

@NgModule({
  declarations: [LanguagesSigninComponent],
  imports: [MatButtonModule, MatIconModule, MatMenuModule, SharedModule, TranslocoModule],
  exports: [LanguagesSigninComponent],
})
export class LanguagesSigninModule {}
