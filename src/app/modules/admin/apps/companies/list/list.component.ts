import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { CompanyService } from '../../../../../shared/services/company.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { User } from '../../../../../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Company } from '../../../../../shared/models/company';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  company: Company;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<Company>;
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

  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
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
    this.companyService
      .getCompanies(
        this.currentSize,
        this.currentPage,
        this.filterOptions.sortCode,
        this.filterOptions.sortName,
        this.filterOptions.search,
      )
      .subscribe(
        (res: Pagination<Company>) => {
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
  openEdit(company) {
    this._router.navigate([`${company._id}/edit`], { relativeTo: this.route });
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
  addCompany(): void {
    this._router.navigate(['add'], { relativeTo: this.route });
  }
  deleteCompany(company) {
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
        this.companyService.deleteCompany(company._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
}
