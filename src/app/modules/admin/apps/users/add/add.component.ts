import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../../../../shared/models/user';
import { UserService } from '../../../../../shared/services/user.service';
import { fuseAnimations } from '../../../../../../@fuse/animations';
import { environment } from '../../../../../../environments/environment';
import { listTypes, Types } from '../../../../../shared/enums/types';
import { TranslocoHttpLoader } from '../../../../../transloco/transloco-root.module';
import { CompanyService } from '../../../../../shared/services/company.service';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { BreadcrumbService } from 'xng-breadcrumb';
import { Group } from '../../../../../shared/models/group';
import { GroupService } from '../../../../../shared/services/group.service';
import { Company } from '../../../../../shared/models/company';

@Component({
  selector: 'app-details',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
  animations: fuseAnimations,
})
export class AddComponent implements OnInit {
  url = `${environment.services.i18n.url}/assets/`;
  readonly Types = Types;
  user = new User();
  loading = false;
  listTypes = listTypes;
  isLoading: boolean;
  password: string;
  confirmPassword: string = null;
  filteredListGroups: any;
  connectedUser: User;
  listGroups: Group[];
  avatar: File = null;
  image: string;
  imageSrc: string | ArrayBuffer;
  avatarExist = false;
  companyId: string;
  company: Company;

  constructor(
    public userService: UserService,
    public groupService: GroupService,
    private translocoHttpLoader: TranslocoHttpLoader,
    private companyService: CompanyService,
    private _router: Router,
    private snackBarService: SnackBarService,
    private _fuseConfirmationService: FuseConfirmationService,
    private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService,
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.set('home/users/add', 'Add');
    this.user.defaultSite = null;
    this.groupService.getAllGroups().subscribe((d) => {
      this.listGroups = d;
      this.filteredListGroups = this.listGroups;
    });
    this.userService.getUserProfile().subscribe(
      (res: User) => {
        this.connectedUser = res;
      },
      () => {},
    );
  }
  createUser(myForm: NgForm): void {
    if (!this.user.password || this.user.password === '') {
      this.user.password = null;
    }
    if (this.confirmPassword === '') {
      this.confirmPassword = null;
    }
    if (myForm.valid) {
      if (this.user.password !== this.confirmPassword) {
        this.snackBarService.openSnackBar('Confirm password not match', 'error');
      } else {
        const data: FormData = new FormData();
        if (this.avatar) {
          data.append(`avatar`, this.avatar, this.avatar.name);
        }
        this.isLoading = true;
        this.userService.addUser(this.user).subscribe(
          (user) => {
            if (this.avatar) {
              this.sendAvatar(user._id);
              this.isLoading = false;
            }
            this._router.navigate([`../${user._id}`], { relativeTo: this.route });
          },
          () => {
            this.isLoading = false;
          },
        );
      }
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

  onAvatarSelected(event: Event): void {
    event.stopPropagation();
    if (event.target['files'] && event.target['files'].length > 0) {
      [this.avatar] = event.target['files'];
      const file = event.target['files'][0];
      const reader = new FileReader();
      reader.onload = () => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);
      this.avatarExist = true;
    }
  }
  sendAvatar(id): void {
    const data: FormData = new FormData();
    data.append(`avatar`, this.avatar, this.avatar.name);
    this.userService.updateAvatar(data, id).subscribe(
      (user: User) => {
        this.user = user;
      },
      () => {},
    );
  }
}
