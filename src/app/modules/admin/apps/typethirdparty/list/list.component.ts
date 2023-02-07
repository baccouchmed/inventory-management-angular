import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { TypeThirdPartyService } from '../../../../../shared/services/typethirdparty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { User } from '../../../../../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { TypeThirdParty } from '../../../../../shared/models/third-party-type';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { listThirdPartyTypeNature } from '../../../../../shared/enums/thirdPartyTypeNature';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  typethirdparty: TypeThirdParty;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<TypeThirdParty>;
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
  selectedTypeThirdParty: TypeThirdParty | null = null;
  listNature = listThirdPartyTypeNature;
  code: string;
  label: string;
  nature: string;
  suffix: string;
  length: number;
  constructor(
    private userService: UserService,
    private typeThirdpartyService: TypeThirdPartyService,
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
    this.typeThirdpartyService
      .getTypeThirdParty(
        this.currentSize,
        this.currentPage,
        this.filterOptions.sortCode,
        this.filterOptions.sortName,
        this.filterOptions.search,
      )
      .subscribe(
        (res: Pagination<TypeThirdParty>) => {
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
  openEdit(thirdparty) {
    this.selectedTypeThirdParty = thirdparty;
    this.code = this.selectedTypeThirdParty.code;
    this.label = this.selectedTypeThirdParty.label;
    this.nature = this.selectedTypeThirdParty.nature;
    this.suffix = this.selectedTypeThirdParty.suffix;
    this.length = this.selectedTypeThirdParty.length;
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
  addTypeThirdParty(): void {
    this._router.navigate(['add'], { relativeTo: this.route });
  }
  deleteThirdParty(typethirdparty) {
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
        this.typeThirdpartyService.deleteTypeThirdParty(typethirdparty._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
  closeDetails(myForm: NgForm) {
    if (myForm.pristine) {
      this.selectedTypeThirdParty = null;
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
          this.selectedTypeThirdParty = null;
        }
      });
    }
  }
  updateTypeThirdParty(myForm): void {
    if (myForm.valid) {
      this.selectedTypeThirdParty.code = this.code;
      this.selectedTypeThirdParty.label = this.label;
      this.selectedTypeThirdParty.nature = this.nature;
      this.selectedTypeThirdParty.suffix = this.suffix;
      this.selectedTypeThirdParty.length = this.length;
      this.typeThirdpartyService.updateTypeThirdParty(this.selectedTypeThirdParty).subscribe(
        () => {
          this.selectedTypeThirdParty = null;
        },
        () => {
          this.getList();
        },
      );
    }
  }
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
