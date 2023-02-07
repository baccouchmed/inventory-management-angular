import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { User } from '../../../../../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { UserState } from '../../../../../shared/enums/userState';
import { SnackBarService } from '../../../../../shared/services/snack-bar.service';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  listUserState = UserState;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<User>;
  typingTimer;
  doneTypingInterval = 500;
  user: User;
  connectedUser: User;
  url = `${environment.api}/public/`;
  urlFlag = `${environment.services.i18n.url}/assets/`;
  isScreenSmall: boolean;
  path: string;
  searchFilter: string;
  isLoading = false;
  count: number;
  sortCode: string;
  sortName: string;
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;

  constructor(
    private userService: UserService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private snackBarService: SnackBarService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    // eslint-disable-next-line prefer-destructuring
    this.path = window.location.pathname.split('/apps/')[1];
    this.userService.getUserProfile().subscribe(
      (res: User) => {
        this.connectedUser = res;
      },
      () => {},
    );
    this.getList();
  }
  pageChanged(event): void {
    let { pageIndex } = event;
    const { pageSize } = event;
    pageIndex++;
    if (pageSize !== this.currentSize) {
      pageIndex = 1;
      this.paginator.firstPage();
    }
    this.currentSize = pageSize;
    this.currentPage = pageIndex;
    this.getList();
  }
  getList(): void {
    this.isLoading = true;
    this.userService
      .getUsers(
        this.currentSize,
        this.currentPage,
        this.searchFilter,
        this.filterOptions.sortCode,
        this.filterOptions.sortName,
      )
      .subscribe(
        (res: Pagination<User>) => {
          this.displayedList = res;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }
  refresh(): void {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getList();
    }, this.doneTypingInterval);
  }
  openShow(row) {
    this._router.navigate([`${row._id}`], { relativeTo: this.route });
  }
  openEdit(user) {
    this._router.navigate([`${user._id}/edit`], { relativeTo: this.route });
  }
  updateSearch() {
    clearTimeout(this.typingTimer);
    this.filterOptions.search = this.searchFilter;
    this.isLoading = true;
    this.typingTimer = setTimeout(() => {
      this.paginator?.firstPage();
      this.getList();
    }, this.doneTypingInterval);
  }
  updateSort(sort) {
    this.isLoading = true;
    switch (sort) {
      case 'sortCode':
        if (this.sortCode === 'up') {
          this.sortCode = 'down';
        } else {
          this.sortCode = 'up';
        }
        this.filterOptions.sortName = null;
        this.filterOptions.sortCode = this.sortCode;
        break;
      case 'sortName':
        if (this.sortName === 'up') {
          this.sortName = 'down';
        } else {
          this.sortName = 'up';
        }
        this.filterOptions.sortCode = null;
        this.filterOptions.sortName = this.sortName;
        break;
      default:
        break;
    }

    this.getList();
  }
  addUser(): void {
    this._router.navigate(['add'], { relativeTo: this.route });
  }
  deleteUser(user) {
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
        this.userService.deleteUser(user._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
  enable(user: User, event): void {
    event.stopPropagation();
    this.isLoading = true;
    this.userService.enableAccount(user._id).subscribe(
      (data: User) => {
        this.isLoading = false;
        user = data;
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  sendVerificationCode(user: User) {
    let url = window.location.href;
    let arr = url.split('/');
    const params = {
      resetUrl: `${arr[0]}//${arr[2]}/confirmation-required?email=${user.email}`,
    };
    this.isLoading = true;
    this.userService.resendCode(user._id, params).subscribe(
      () => {
        this.snackBarService.openSnackBar('Code has been sent successfully', 'success');
        this.isLoading = false;
        this.getList();
      },
      () => {
        this.isLoading = false;
      },
    );
  }
}
