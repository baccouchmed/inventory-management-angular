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
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  isLoading: boolean;
  group = new Group();
  url = `${environment.services.i18n.url}/assets/`;
  id: string;
  groupFeature: GroupFeature[];
  testGroup: GroupFeature[];
  featureId: Feature[] = [];
  listFeature: Feature[] = [];
  filteredList = [];
  featureWithId: string[] = [];
  type: boolean[] = [true, true, true, true, true, true];
  index: number;
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
                this.testGroup = groupFeature;
                this.filteredList = this.listFeature.map(() => this.listFeature);
                this.featureId = this.groupFeature.map((value) => value.featuresId);
                this.featureWithId = this.featureId.map((site) => site._id);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                if (this.groupFeature.length !== this.listFeature.length) {
                  this.groupFeature.push({
                    featuresId: null,
                    list: true,
                    create: true,
                    update: true,
                    read: true,
                    delete: true,
                    status: true,
                    defaultFeature: false,
                  });
                }
              },
              () => {},
            );
          },
          () => {},
        );
      }
    });
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

  grantAll(event) {
    event.stopPropagation();
    this.filteredList = this.listFeature.map(() => this.listFeature);
    //this.featureId = this.listFeature.map((value) => value);
    let i = 0;
    for (const group of this.groupFeature) {
      if (group.featuresId === null) {
        this.groupFeature.splice(i, 1);
      }
      i++;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const feature of this.listFeature) {
      if (!this.featureId.map((value) => value._id).includes(feature._id) && feature._id) {
        this.featureId.push(feature);
        this.groupFeature.push({
          featuresId: feature,
          list: true,
          create: true,
          update: true,
          read: true,
          delete: true,
          status: true,
          defaultFeature: false,
        });
      }
      this.index++;
    }
    this.featureWithId = this.listFeature.map((site) => site._id);
  }

  revokeAll(event) {
    event.stopPropagation();
    this.filteredList = [];
    this.filteredList.push(this.listFeature);
    this.featureId = [];
    this.groupFeature = [
      {
        featuresId: null,
        list: true,
        create: true,
        update: true,
        read: true,
        delete: true,
        status: true,
        defaultFeature: false,
      },
    ];
    this.type = [true, true, true, true, true, true];
    this.featureWithId = [];
  }
  deleteRow(index) {
    this.featureId.splice(index, 1);
    this.groupFeature[index] = this.groupFeature[index + 1];
    this.groupFeature.splice(index, 1);
    if (this.groupFeature[this.groupFeature.length - 1].featuresId) {
      this.groupFeature.push({
        featuresId: null,
        list: true,
        create: true,
        update: true,
        read: true,
        delete: true,
        status: true,
        defaultFeature: false,
      });
    }
    this.featureWithId.splice(index, 1);
  }
  addRow(index, value): void {
    if (value !== null) {
      this.featureId[index] = this.listFeature.filter((val) => val._id === value)[0];
      this.featureWithId[index] = value;
      this.groupFeature[index].featuresId = this.listFeature.filter((val) => val._id === value)[0];
      this.filteredList.push(this.listFeature);
      if (
        this.groupFeature[index] &&
        this.groupFeature.length - 1 === index &&
        this.groupFeature.length !== this.listFeature.length
      ) {
        this.groupFeature.push({
          featuresId: null,
          list: true,
          create: true,
          read: true,
          update: true,
          delete: true,
          status: true,
          defaultFeature: false,
        });
      }
    } else {
      this.deleteRow(index);
    }
  }
  cancelEdit(myForm: NgForm) {
    if (myForm.pristine && this.testGroup === this.groupFeature) {
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
  updateGroup(myForm: NgForm): void {
    if (myForm.valid) {
      if (!this.groupFeature[0].featuresId || !this.groupFeature[0].featuresId._id) {
        this.snackBarService.openSnackBar('feature is required', 'error');
      } else {
        if (!this.groupFeature[this.groupFeature.length]) {
          this.groupFeature.splice(this.groupFeature.length, 1);
        }
        if (this.groupFeature.filter((value) => value.defaultFeature).length === 0) {
          this.snackBarService.openSnackBar('Default feature is required', 'error');
        } else {
          this.groupService.updateUser(this.group, this.groupFeature).subscribe(() => {
            this._router.navigate(['../'], { relativeTo: this.route });
          });
        }
      }
    }
  }
  activate(type: string) {
    for (const group of this.groupFeature) {
      if (type === 'list') {
        group.list = !this.type[0] ? true : false;
      }
      if (type === 'create') {
        group.create = !this.type[1] ? true : false;
      }
      if (type === 'read') {
        group.read = !this.type[2] ? true : false;
      }
      if (type === 'update') {
        group.update = !this.type[3] ? true : false;
      }
      if (type === 'delete') {
        group.delete = !this.type[4] ? true : false;
      }
      if (type === 'status') {
        if (!this.type[5]) {
          group.status = true;
        } else {
          group.status = false;
          group.defaultFeature = false;
        }
      }
    }
    if (type === 'list') {
      this.type[0] = !this.type[0];
    }
    if (type === 'create') {
      this.type[1] = !this.type[1];
    }
    if (type === 'read') {
      this.type[2] = !this.type[2];
    }
    if (type === 'update') {
      this.type[3] = !this.type[3];
    }
    if (type === 'delete') {
      this.type[4] = !this.type[4];
    }
    if (type === 'status') {
      this.type[5] = !this.type[5];
    }
  }
  testActivate(type: string) {
    if (type === 'list' && this.type[0]) {
      this.type[0] = false;
    }
    if (type === 'create' && this.type[1]) {
      this.type[1] = false;
    }
    if (type === 'read' && this.type[2]) {
      this.type[2] = false;
    }
    if (type === 'update' && this.type[3]) {
      this.type[3] = false;
    }
    if (type === 'delete' && this.type[4]) {
      this.type[4] = false;
    }
    if (type === 'status' && this.type[5]) {
      this.type[5] = false;
    }
  }
  default(index) {
    this.groupFeature.map((value) => {
      value.defaultFeature = false;
    });
    this.groupFeature[index].defaultFeature = true;
  }
  checkDefault(index) {
    if (
      !this.groupFeature[index].featuresId ||
      !this.groupFeature[index].featuresId.link ||
      !this.groupFeature[index].status
    ) {
      this.groupFeature[index].defaultFeature = false;
    }
  }
}
