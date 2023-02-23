import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';
import { FuseMediaWatcherService } from '../../../../../../@fuse/services/media-watcher';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Pagination } from '../../../../../shared/models/pagination';
import { environment } from '../../../../../../environments/environment';
import { UserState } from '../../../../../shared/enums/userState';
import { FeatureCodes } from '../../../../../shared/enums/feature-codes';
import { FeatureActions } from '../../../../../shared/enums/feature-actions';
import { CompanyProductService } from '../../../../../shared/services/company-product.service';
import { CompanyProduct, ProductStock, TypeProduct } from 'app/shared/models/inventory';
import { FilterProduct } from 'app/shared/models/filter-product';
import { forkJoin } from 'rxjs';
import { InventoryService } from '../../../../../shared/services/inventory.service';
import { UserService } from '../../../../../shared/services/user.service';
import { BadgeService } from '../../../../../shared/services/badge.service';

@Component({
  selector: 'app-deduct',
  templateUrl: './deduct.component.html',
  styleUrls: ['./deduct.component.scss'],
})
export class DeductComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  filterOptions: FilterOptions = new FilterOptions();
  listUserState = UserState;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<ProductStock>;
  typingTimer;
  doneTypingInterval = 500;
  url = `${environment.api}/public/`;
  isScreenSmall: boolean;
  openFilters: boolean = false;
  path: string;
  searchFilter: string;
  isLoading = false;
  count: number;
  sortCode: string;
  sortName: string;
  featureCodes = FeatureCodes;
  featureActions = FeatureActions;
  urlLogo = `${environment.api}/public/logo/`;
  filterProduct = new FilterProduct();
  listCompanies: CompanyProduct[];
  filteredListCompanies = [];
  listTypeProducts: TypeProduct[];
  filteredListTypeProducts = [];
  advancedFilter: any;
  typeProduct: TypeProduct;
  companyProduct: CompanyProduct;
  inStock: number;
  minStock: boolean;
  constructor(
    private companyProductService: CompanyProductService,
    private _router: Router,
    private route: ActivatedRoute,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseConfirmationService: FuseConfirmationService,
    private inventoryService: InventoryService,
    private userService: UserService,
    private badgeService: BadgeService,
  ) {}

  ngOnInit(): void {
    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$.subscribe(({ matchingAliases }) => {
      // Check if the screen is small
      this.isScreenSmall = !matchingAliases.includes('sm');
    });
    const obs = [
      this.companyProductService.getAllTypeProducts(),
      this.companyProductService.getListCompanies(),
    ];
    this.isLoading = true;
    forkJoin(obs).subscribe(
      (result: [TypeProduct[], CompanyProduct[]]) => {
        this.listCompanies = result[1];
        this.filteredListCompanies = this.listCompanies;
        this.listTypeProducts = result[0];
        this.filteredListTypeProducts = this.listTypeProducts;
        this.getList();
      },
      () => {
        this.isLoading = false;
      },
    );
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
      .getProductStocks(
        this.currentSize,
        this.currentPage,
        this.searchFilter,
        this.typeProduct ? this.typeProduct._id : null,
        this.companyProduct ? this.companyProduct._id : null,
        this.inStock || null,
        this.minStock || null,
      )
      .subscribe(
        (res: Pagination<ProductStock>) => {
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
  openFilter() {
    this.openFilters = !this.openFilters;
  }
  deductStock(id, quantityOut, index) {
    this.inventoryService.deductStock(id, quantityOut).subscribe(() => {
      this.displayedList.data[index].quantity = null;
      this.displayedList.data[index].inStock -= quantityOut;

      this.badgeService.badgeStocks().subscribe(() => {
        let navigation = this.userService._navigations.getValue();
        navigation[
          navigation.findIndex((val) => val.code === FeatureCodes.setting.toString())
        ].children[
          navigation[
            navigation.findIndex((val) => val.code === FeatureCodes.setting.toString())
          ].children.findIndex((val) => val.code === FeatureCodes.stocks.toString())
        ].badge.title = this.badgeService._badgeStock.getValue();
        this.userService._navigations.next(navigation);
      });
    });
  }
}
