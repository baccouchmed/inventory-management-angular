import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutModule } from 'app/layout/layouts/empty/empty.module';
import { ClassyLayoutModule } from 'app/layout/layouts/vertical/classy/classy.module';
import { SettingsModule } from 'app/layout/common/settings/settings.module';
import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from './common/user/user.module';

const layoutModules = [
  // Empty
  EmptyLayoutModule,
  // Vertical navigation
  ClassyLayoutModule,
  UserModule,
];

@NgModule({
  declarations: [LayoutComponent],
  imports: [
    MatIconModule,
    MatTooltipModule,
    FuseDrawerModule,
    SharedModule,
    SettingsModule,
    ...layoutModules,
    SettingsModule,
  ],
  exports: [LayoutComponent, ...layoutModules],
})
export class LayoutModule {}
