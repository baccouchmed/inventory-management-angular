import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { Site } from '../../../../../../../shared/models/site';
import { environment } from '../../../../../../../../environments/environment';
import { TranslocoHttpLoader } from '../../../../../../../transloco/transloco-root.module';
import { Local } from '../../../../../../../shared/models/local';
import { NgForm } from '@angular/forms';
import { UserService } from '../../../../../../../shared/services/user.service';
import { User } from '../../../../../../../shared/models/user';
import { listTypes, Types } from '../../../../../../../shared/enums/types';
import { CompanyService } from '../../../../../../../shared/services/company.service';
import { ThirdParty } from '../../../../../../../shared/models/third-party';
import { TypeThirdParty } from '../../../../../../../shared/models/third-party-type';
import { Group } from '../../../../../../../shared/models/group';
import { GroupService } from '../../../../../../../shared/services/group.service';
import { ThirdPartyService } from '../../../../../../../shared/services/thirdparty.service';
import { TypeThirdPartyService } from '../../../../../../../shared/services/typethirdparty.service';
import { FeatureCodes } from '../../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../../shared/enums/feature-actions';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  id: string;
  sites: Site[];
  url = `${environment.services.i18n.url}/assets/`;
  readonly Types = Types;
  user = new User();
  loading = false;
  listTypes = listTypes;
  listLocals: Local[];
  filteredListLocals = [];
  filteredListGroups: any;
  deletedSites = [];
  avatar: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  avatarExist = false;
  isLoading: any;
  urlAvatar = `${environment.api}/public/avatar/`;
  connectedUser: User;
  loadingAvatar: boolean;
  filteredList = [];
  index: number;
  TableSiteId = [1];
  thirdPartyId: ThirdParty;
  thirdPartyTypeId: TypeThirdParty;
  siteWithId: string[] = [];
  companyId: string;
  listThirdParty: ThirdParty[];
  filteredListThirdParty = [];
  listTypeThirdParty: TypeThirdParty[];
  group: Group;
  filteredListTypeThirdParty = [];
  listGroups: Group[];
  filtredListGroup = [];
  compareSite: any[] = [];
  touched: boolean = false;
  confirmPassword: string = null;
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;

  constructor(
    private userService: UserService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
    private _fuseConfirmationService: FuseConfirmationService,
    private translocoHttpLoader: TranslocoHttpLoader,
    private companyService: CompanyService,
    public groupService: GroupService,
    public thirdPartyService: ThirdPartyService,
    public typeThirdPartyService: TypeThirdPartyService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.userService.getSingleUserProfile(this.id).subscribe(
          (user) => {
            this.user = { ...this.user, ...user };
            this.typeThirdPartyService.getAllTypeThirdParty().subscribe((d) => {
              this.listTypeThirdParty = d;
              this.filteredListTypeThirdParty = this.listTypeThirdParty;
            });

            this.groupService.getAllGroups().subscribe((d) => {
              this.listGroups = d;
              this.filteredListGroups = this.listGroups;
            });
            this.thirdPartyId = this.user.thirdPartyId;
            this.thirdPartyTypeId = this.user.thirdPartyTypeId;
            this.group = this.user.groupsId;
            if (this.user.avatar) {
              this.avatarExist = true;
            }
            if (this.user.thirdPartyTypeId) {
              this.thirdPartyService
                .getThirdPartyList(this.user.thirdPartyTypeId._id)
                .subscribe((d) => {
                  this.listThirdParty = d;
                  this.filteredListThirdParty = this.listThirdParty;
                });
            }
              this.userService.getUserProfile().subscribe(
                (res: User) => {
                  this.connectedUser = res;
                },
                () => {},
              );

            this.breadcrumbService.set('home/users/:id', this.user.name);
          },
          () => {},
        );
      }
    });

    this.translocoHttpLoader.getAllLocals().subscribe((locals) => {
      this.listLocals = locals;
      this.filteredListLocals = this.listLocals;
    });
  }

  addSiteRow(event: MouseEvent) {
    event.stopPropagation();
    this.sites.push({
      code: '',
      label: '',
      address: '',
      countryId: null,
      cityId: null,
    });
  }

  deleteUser() {
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
        this.userService.deleteUser(this.user._id).subscribe(() => {
          this._router.navigate(['']);
        });
      }
    });
  }
  cancelEdit() {
    if (!this.touched) {
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
  updateUser(myForm: NgForm): void {
    if (!this.user.password || this.user.password === '') {
      this.user.password = null;
    }
    if (this.confirmPassword === '') {
      this.confirmPassword = null;
    }
  if (myForm.valid) {
        if (this.user.password && this.user.password !== this.confirmPassword) {
          this.snackBarService.openSnackBar('Confirm password not match', 'error');
        } else {
          this.isLoading = true;
          this.userService.updateUser(this.user).subscribe(
            () => {
              this._router.navigate(['../'], { relativeTo: this.route });
              this.isLoading = false;
            },
            () => {
              this.isLoading = false;
            },
          );
        }
    }
  }

  onAvatarSelected(event: Event): void {
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.avatar] = event.target['files'];
      this.sendAvatar();
    }
  }
  sendAvatar(): void {
    const data: FormData = new FormData();
    data.append(`avatar`, this.avatar, this.avatar.name);
    this.loadingAvatar = true;
    this.userService.updateAvatar(data, this.user._id).subscribe(
      (user: User) => {
        this.user.avatar = user.avatar;
        this.loadingAvatar = false;
      },
      () => {
        this.loadingAvatar = false;
      },
    );
  }
  refreshDefaultLocal(val: any) {
    this.user.defaultLocal =
      this.listLocals[this.listLocals.map((value) => value._id).indexOf(val)];
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
  updateThirdParty(value: any) {
    if (value) {
      this.thirdPartyId = value;
      this.user.thirdPartyId = value;
    } else {
      this.user.thirdPartyId = null;
      this.thirdPartyId = null;
    }
  }
  updateThirdPartyType(value: any) {
    if (value) {
      this.thirdPartyTypeId = value;
      this.user.thirdPartyTypeId = value;
    } else {
      this.user.thirdPartyTypeId = null;
      this.thirdPartyTypeId = null;
    }
  }
  updateGroup(value: any) {
    if (value) {
      this.group = value;
      this.user.groupsId = value;
    } else {
      this.user.groupsId = null;
      this.group = null;
    }
  }
  refreshListThirdParty(value: any) {
    if (value !== null) {
      this.user.thirdPartyId = null;

      this.thirdPartyService.getThirdPartyList(value).subscribe((d) => {
        this.listThirdParty = d;
        this.filteredListThirdParty = this.listThirdParty;
      });
    } else {
      this.user.thirdPartyId = null;
      this.filteredListThirdParty = [];
    }
  }
}
