import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Feature } from '../../../../../../../shared/models/feature';
import { FeatureService } from '../../../../../../../shared/services/feature.service';
import { NgForm } from '@angular/forms';
import { material } from '../../../../../../../mock-api/ui/icons/data';
import { environment } from '../../../../../../../../environments/environment';
import { Local } from '../../../../../../../shared/models/local';
import { listFeatureStatus, FeatureStatus } from '../../../../../../../shared/enums/featureStatus';
import { listFeatureType, FeatureType } from '../../../../../../../shared/enums/featureType';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  feature = new Feature();
  isLoading: any;
  url = `${environment.services.i18n.url}/assets/`;
  readonly FeatureType = FeatureType;
  readonly FeatureStatus = FeatureStatus;
  listFeatureStatus = listFeatureStatus;
  listFeatureType = listFeatureType;
  loading = false;
  listLocals: Local[];
  filteredListLocals = [];
  filteredListIcons = [];
  listFeature = [];
  listIcons = [];
  divider: string;
  constructor(
    private featureService: FeatureService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  ngOnInit(): void {
    this.featureService.getFeatureParent().subscribe((d) => {
      this.listFeature = d;
      this.route.paramMap.subscribe((param) => {
        this.id = param.get('id');
        if (this.id) {
          this.featureService.getFeature(this.id).subscribe(
            (feature) => {
              if (feature.featuresIdParent) {
                feature.featuresIdParent = this.listFeature.find(
                  (l) => l._id === feature.featuresIdParent._id,
                );
              }
              this.listFeature = this.listFeature.filter((val) => val._id !== feature._id);
              this.feature = feature;
              if (this.feature.divider === true) {
                this.divider = 'true';
              } else {
                this.divider = 'false';
              }
              this.breadcrumbService.set('home/features/:id', this.feature.title);
            },
            () => {},
          );
        }
      });
    });

    this.listIcons = material;
    this.filteredListIcons = material;
  }
  updateFeature(myForm: NgForm) {
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
      this.featureService.updateFeature(this.feature).subscribe(() => {
        this._router.navigate(['../'], { relativeTo: this.route });
      });
    }
  }

  cancelEdit(myForm: NgForm) {
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
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  deleteFeature(feature) {
    // Open the confirmation dialog
    const confirmation = this._fuseConfirmationService.open({
      title: 'Delete',
      message: 'Would you like to confirm the deletion ?',
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
        this.featureService.deleteFeature(feature._id).subscribe(() => {
          this._router.navigate(['/home/features']);
        });
      }
    });
  }
}
