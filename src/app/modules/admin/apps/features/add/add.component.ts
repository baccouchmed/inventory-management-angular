import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Feature } from '../../../../../shared/models/feature';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { Local } from '../../../../../shared/models/local';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { listFeatureStatus } from '../../../../../shared/enums/featureStatus';
import { listFeatureType, FeatureType } from '../../../../../shared/enums/featureType';
import { FeatureService } from '../../../../../shared/services/feature.service';
import { material } from '../../../../../mock-api/ui/icons/data';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  url = `${environment.services.i18n.url}/assets/`;
  readonly FeatureType = FeatureType;
  listFeatureStatus = listFeatureStatus;
  listFeatureType = listFeatureType;
  feature = new Feature();
  loading = false;
  isLoading = false;
  listLocals: Local[];
  filteredListLocals = [];
  filteredListIcons = [];
  listFeature = [];
  listIcons = [];
  divider: string;
  constructor(
    public featureService: FeatureService,
    private translocoHttpLoader: TranslocoHttpLoader,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.listIcons = material;
    this.filteredListIcons = material;
    this.breadcrumbService.set('home/features/add', 'Add');
    this.translocoHttpLoader.getAllLocals().subscribe((locals) => {
      this.listLocals = locals;
      this.filteredListLocals = this.listLocals;
    });
    this.featureService.getFeatureParent().subscribe((d) => {
      this.listFeature = d;
    });
    this.feature.divider = true;
  }
  addFeature(myForm: NgForm): void {
    if (myForm.valid) {
      if (this.divider === 'true') {
        this.feature.divider = true;
      } else {
        this.feature.divider = false;
      }
      if (this.feature.type === FeatureType.group) {
        this.feature.link = null;
      } else {
        this.feature.subtitle = null;
      }
      this.featureService.addFeature(this.feature).subscribe(() => {
        this._router.navigate([`../`], { relativeTo: this.route });
      });
    }
  }

  resetForm(myForm: NgForm, event) {
    event.stopPropagation();
    if (myForm.pristine) {
      myForm.resetForm();
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Clear',
        message: 'Would you like to clear the information ?',
        actions: {
          confirm: {
            label: 'yes',
          },
          cancel: {
            label: 'no',
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          myForm.resetForm();
        }
      });
    }
  }
  cancelForm(myForm: NgForm) {
    if (myForm.pristine) {
      this._router.navigate([`../`], { relativeTo: this.route });
    } else {
      // Open the confirmation dialog
      const confirmation = this._fuseConfirmationService.open({
        title: 'Cancel',
        message: 'Would you like to cancel the modification ?',
        actions: {
          confirm: {
            label: 'yes',
          },
          cancel: {
            label: 'no',
          },
        },
      });
      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) => {
        // If the confirm button pressed...
        if (result === 'confirmed') {
          this._router.navigate([`../`], { relativeTo: this.route });
        }
      });
    }
  }
  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
