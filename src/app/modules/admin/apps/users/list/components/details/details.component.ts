import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../../../../shared/models/user';
import { UserService } from '../../../../../../../shared/services/user.service';
import { SnackBarService } from '../../../../../../../shared/services/snack-bar.service';
import { AuthService } from '../../../../../../../shared/services/auth.service';
import { environment } from '../../../../../../../../environments/environment';
import { Local } from '../../../../../../../shared/models/local';
import { listTypes, Types } from '../../../../../../../shared/enums/types';
import { BreadcrumbService } from 'xng-breadcrumb';
import { FuseConfirmationService } from '../../../../../../../../@fuse/services/confirmation';
import { ThirdParty } from '../../../../../../../shared/models/third-party';
import { TypeThirdParty } from '../../../../../../../shared/models/third-party-type';
import { Group } from '../../../../../../../shared/models/group';
import { GroupService } from '../../../../../../../shared/services/group.service';
import { ThirdPartyService } from '../../../../../../../shared/services/thirdparty.service';
import { TypeThirdPartyService } from '../../../../../../../shared/services/typethirdparty.service';
import { UserState } from '../../../../../../../shared/enums/userState';
import { TranslocoHttpLoader } from '../../../../../../../transloco/transloco-root.module';
import { FeatureCodes } from '../../../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../../../shared/enums/feature-actions';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
  url = `${environment.services.i18n.url}/assets/`;
  urlAvatar = `${environment.api}/public/avatar/`;
  readonly Types = Types;
  listUserState = UserState;
  userState: string;
  user = new User();
  loading = false;
  listTypes = listTypes;
  listLocals: Local[];
  filteredListLocals = [];
  isLoading: boolean = false;
  password: string;
  filteredListGroups: any;
  connectedUser: User;
  avatar: File = null;
  image: string;
  id: string;
  listGroups: Group[];
  listThirdParty: ThirdParty[];
  filteredListThirdParty = [];
  listTypeThirdParty: TypeThirdParty[];
  group: Group;
  filteredListTypeThirdParty = [];
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;

  constructor(
    private breadcrumbService: BreadcrumbService,
    public userService: UserService,
    private _changeDetectorRef: ChangeDetectorRef,
    private snackBarService: SnackBarService,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    public groupService: GroupService,
    public thirdPartyService: ThirdPartyService,
    public typeThirdPartyService: TypeThirdPartyService,
    private translocoHttpLoader: TranslocoHttpLoader,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.typeThirdPartyService.getAllTypeThirdParty().subscribe((d) => {
          this.listTypeThirdParty = d;
          this.filteredListTypeThirdParty = this.listTypeThirdParty;
        });
        this.thirdPartyService.getAllThirdParty().subscribe((d) => {
          this.listThirdParty = d;
          this.filteredListThirdParty = this.listThirdParty;
        });
        this.groupService.getAllGroups().subscribe((d) => {
          this.listGroups = d;
          this.filteredListGroups = this.listGroups;
        });
        this.isLoading = true;
        this.getUser();
      }
    });
    this.translocoHttpLoader.getAllLocals().subscribe((locals) => {
      this.listLocals = locals;
      this.filteredListLocals = this.listLocals;
    });
  }

  getUser() {
    this.userService.getSingleUserProfile(this.id).subscribe(
      (user) => {
        this.user = { ...this.user, ...user };
          this.userState = user.state;
        this.isLoading = false;

        this.breadcrumbService.set('home/users/:id', this.user.name);
      },
      () => {
        this.isLoading = false;
      },
    );
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

  addUser() {
    this._router.navigate(['/home/users/add']);
  }

  editUser() {
    this._router.navigate([`/home/users/${this.user._id}/edit`]);
  }
  sendVerificationCode(user: User) {
    let url = window.location.href;
    let arr = url.split('/');
    this.isLoading = true;
    const params = {
      resetUrl: `${arr[0]}//${arr[2]}/confirmation-required?email=${user.email}`,
    };
    this.userService.resendCode(user._id, params).subscribe(
      () => {
        this.snackBarService.openSnackBar('Code has been sent successfully', 'success');
        this.getUser();
      },
      () => {
        this.isLoading = false;
      },
    );
  }
}
