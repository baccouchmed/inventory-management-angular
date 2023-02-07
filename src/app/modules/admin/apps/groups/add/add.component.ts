import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Group } from '../../../../../shared/models/group';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { Local } from '../../../../../shared/models/local';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FeatureService } from '../../../../../shared/services/feature.service';
import { Feature } from '../../../../../shared/models/feature';
import { GroupService } from 'app/shared/services/group.service';
import { GroupFeature } from '../../../../../shared/models/group-feature';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  url = `${environment.services.i18n.url}/assets/`;
  group = new Group();
  loading = false;
  filteredListTypes: any[];
  listLocals: Local[];
  filteredListLocals = [];
  isLoading: any;
  filteredListGroups: any;
  featureId: Feature[] = [];
  filteredList = [];
  listFeature: Feature[];
  type: boolean[] = [true, true, true, true, true, true];
  groupFeature: GroupFeature[] = [new GroupFeature()];
  constructor(
    private translocoHttpLoader: TranslocoHttpLoader,
    private featureService: FeatureService,
    private groupService: GroupService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/groups/add', 'Add');

    this.featureService.getAllFeature().subscribe(
      (feature) => {
        this.listFeature = feature;
        this.filteredList.push(this.listFeature);
      },
      () => {},
    );

    this.translocoHttpLoader.getAllLocals().subscribe((locals) => {
      this.listLocals = locals;
      this.filteredListLocals = this.listLocals;
    });
    this.groupFeature[0] = {
      featuresId: null,
      list: true,
      create: true,
      read: true,
      update: true,
      delete: true,
      status: true,
      defaultFeature: false,
    };
  }

  createGroup(myForm: NgForm): void {
    if (myForm.valid) {
      if (!this.groupFeature[0].featuresId?._id) {
        this.snackBarService.openSnackBar('Feature is required', 'error');
      } else {
        if (!this.groupFeature[this.groupFeature.length]) {
          this.groupFeature.splice(this.groupFeature.length, 1);
        }
        if (this.groupFeature.filter((value) => value.defaultFeature).length === 0) {
          this.snackBarService.openSnackBar('Default feature is required', 'error');
        } else {
          this.groupService.creatGroup(this.group, this.groupFeature).subscribe((group) => {
            this._router.navigate([`../${group._id}`], { relativeTo: this.route });
          });
        }
      }
    }
  }
  resetForm(myForm: NgForm, event) {
    event.stopPropagation();
    if (myForm.pristine && this.featureId.length === 0) {
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
        }
      });
    }
  }
  cancelForm(myForm: NgForm) {
    if (myForm.pristine && this.featureId.length === 0) {
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
  addRow(index, value): void {
    if (value) {
      this.featureId[index] = value;
      this.groupFeature[index].featuresId = value;
      this.filteredList.push(this.listFeature);
      if (
        this.groupFeature[index] &&
        this.groupFeature.length - 1 === index &&
        this.groupFeature.length !== this.listFeature.length
      ) {
        this.groupFeature.push(new GroupFeature());
        this.groupFeature[index + 1] = {
          list: true,
          create: true,
          read: true,
          update: true,
          delete: true,
          status: true,
          defaultFeature: false,
        };
      }
    } else {
      this.deleteRow(index);
    }
  }
  deleteRow(index) {
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
    this.featureId.splice(index, 1);
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

  grantAll(event) {
    event.stopPropagation();
    this.filteredList = this.listFeature.map(() => this.listFeature);
    this.featureId = this.listFeature.map((value) => value);
    this.groupFeature = this.listFeature.map((value) => ({
      featuresId: value,
      list: true,
      create: true,
      update: true,
      read: true,
      delete: true,
      status: true,
      defaultFeature: false,
    }));
    this.type = [true, true, true, true, true, true];
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
    this.type = [false, false, false, false, false, false];
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
