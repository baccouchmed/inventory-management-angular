import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FeatureAuth } from '../../models/feature-auth';

@Directive({
  selector: '[appFeatures]',
})
export class FeaturesDirective {
  private isHidden = true;
  private permissions: FeatureAuth[];

  constructor(
    private viewContainer: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private userService: UserService,
  ) {}
  @Input()
  set appFeatures(val: FeatureAuth[]) {
    this.userService.features$.subscribe((data: FeatureAuth[]) => {
      if (data) {
        this.permissions = val;
        this.updateView();
      }
    });
  }

  private updateView() {
    if (this.userService.checkPermission(this.permissions)) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }
}
