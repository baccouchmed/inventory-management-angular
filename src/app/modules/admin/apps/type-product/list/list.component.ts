import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../../../shared/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { User } from '../../../../../shared/models/user';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { TypeThirdParty } from '../../../../../shared/models/third-party-type';
import { Pagination } from '../../../../../shared/models/pagination';
import { NgForm } from '@angular/forms';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { TypeProduct } from '../../../../../shared/models/inventory';
import { CompanyProductService } from 'app/shared/services/company-product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  stage: TypeProduct;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<TypeProduct>;
  typingTimer;
  doneTypingInterval = 500;
  user: User;
  connectedUser: User;
  isScreenSmall: boolean;
  path: string;
  searchFilter: string;
  isLoading = false;
  count: number;
  sortCode: string;
  sortName: string;
  selectedStage: TypeProduct | null = null;
  label: string;
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;

  constructor(
    private userService: UserService,
    private companyProductService: CompanyProductService,
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
    this.companyProductService
      .getTypeProducts(
        this.currentSize,
        this.currentPage,
        this.filterOptions.sortLabel,
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
  openEdit(stage) {
    this.selectedStage = stage;
    this.label = this.selectedStage.label;
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
  deleteThirdParty(stage) {
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
        this.companyProductService.deleteTypeProduct(stage._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
  closeDetails(myForm: NgForm) {
    if (myForm.pristine) {
      this.selectedStage = null;
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
          this.selectedStage = null;
        }
      });
    }
  }
  updateTypeThirdParty(myForm): void {
    if (myForm.valid) {
      this.selectedStage.label = this.label;
      this.companyProductService.updateTypeProduct(this.selectedStage).subscribe(
        () => {
          this.selectedStage = null;
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
