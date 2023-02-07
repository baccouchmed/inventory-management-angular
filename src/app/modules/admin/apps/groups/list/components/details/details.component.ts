import { Component, OnInit } from '@angular/core';

import { environment } from '../../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { GroupService } from '../../../../../../../shared/services/group.service';
import { Group } from '../../../../../../../shared/models/group';
import { GroupFeature } from '../../../../../../../shared/models/group-feature';
import { Feature } from '../../../../../../../shared/models/feature';
import { FeatureService } from '../../../../../../../shared/services/feature.service';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  isLoading: boolean;
  group = new Group();
  url = `${environment.services.i18n.url}/assets/`;
  id: string;
  groupFeature: GroupFeature[];
  featureId: Feature[] = [];
  listFeature: Feature[] = [];
  filteredList = [];
  constructor(
    private groupService: GroupService,
    private featureService: FeatureService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.featureService.getAllFeature().subscribe(
          (feature) => {
            this.listFeature = feature;

            this.filteredList.push(this.listFeature);
          },
          () => {},
        );
        this.groupService.getGroup(this.id).subscribe(
          (group) => {
            this.group = group;
            this.breadcrumbService.set('home/groups/:id', this.group.label);
            this.groupService.getFeatureGroup(this.group._id).subscribe(
              (groupFeature) => {
                this.groupFeature = groupFeature;
                this.filteredList = this.listFeature.map(() => this.listFeature);
                this.featureId = this.groupFeature.map((value) => value.featuresId);
              },
              () => {},
            );
          },
          () => {},
        );
      }
    });
  }
  addGroup() {
    this._router.navigate(['/home/groups/add']);
  }

  editGroup() {
    this._router.navigate([`/home/groups/${this.group._id}/edit`]);
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  deletegroup() {
    this.groupService.getFeatureGroupTMS(this.id).subscribe(
      (res: GroupFeature[]) => {
        if (res && res.length) {
          this.snackBarService.openSnackBar(
            'You cannot delete this group, There is child data related to this record',
            'error',
          );
        } else {
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
              this.groupService.deletegroup(this.id).subscribe(() => {
                this._router.navigate(['/home/groups']);
              });
            }
          });
        }
      },
      () => {},
    );
  }
}
