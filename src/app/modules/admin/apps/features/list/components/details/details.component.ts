import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Feature } from '../../../../../../../shared/models/feature';
import { FeatureService } from '../../../../../../../shared/services/feature.service';
import { material } from '../../../../../../../mock-api/ui/icons/data';
import { environment } from '../../../../../../../../environments/environment';
import { Local } from '../../../../../../../shared/models/local';
import { listFeatureStatus } from '../../../../../../../shared/enums/featureStatus';
import { listFeatureType, FeatureType } from '../../../../../../../shared/enums/featureType';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  id: string;
  feature = new Feature();
  isLoading: any;
  url = `${environment.services.i18n.url}/assets/`;
  readonly FeatureType = FeatureType;
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
              this.divider = this.feature.divider === true ? 'true' : 'false';
              this.feature = feature;
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
  addFeature() {
    this._router.navigate(['/home/features/add']);
  }
  updateFeature() {
    this._router.navigate([`/home/features/${this.feature._id}/edit`]);
  }
  deleteFeature() {
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
        this.featureService.deleteFeature(this.feature._id).subscribe(() => {});
        this._router.navigate(['/home/features']);
      }
    });
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
