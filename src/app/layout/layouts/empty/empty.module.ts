import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { EmptyLayoutComponent } from 'app/layout/layouts/empty/empty.component';
import { SettingsModule } from '../../common/settings/settings.module';

@NgModule({
  declarations: [EmptyLayoutComponent],
  imports: [RouterModule, SharedModule, SettingsModule],
  exports: [EmptyLayoutComponent],
})
export class EmptyLayoutModule {}
