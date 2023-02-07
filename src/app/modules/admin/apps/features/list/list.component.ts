import { Component, OnInit, ViewChild } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { FilterOptions } from '../../../../../shared/models/filter-options';
import { Feature } from '../../../../../shared/models/feature';
import { Pagination } from '../../../../../shared/models/pagination';
import { FeatureService } from '../../../../../shared/services/feature.service';
import { FuseConfirmationService } from '../../../../../../@fuse/services/confirmation';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filterOptions: FilterOptions = new FilterOptions();
  feature: Feature;
  currentSize = 10;
  currentPage = 1;
  displayedList: Pagination<Feature>;
  typingTimer;
  doneTypingInterval = 500;
  isScreenSmall: boolean;
  isLoading = false;
  count: number;
  sortCode: string;
  sortName: string;
  sortType: string;
  searchFilter: string;

  constructor(
    private _router: Router,
    private route: ActivatedRoute,
    private featureService: FeatureService,
    private _fuseConfirmationService: FuseConfirmationService,
  ) {}
  ngOnInit(): void {
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
    this.featureService
      .getFeatures(
        this.currentSize,
        this.currentPage,
        this.filterOptions.sortCode,
        this.filterOptions.sortName,
        this.filterOptions.sortType,
        this.filterOptions.search,
      )
      .subscribe(
        (res: Pagination<Feature>) => {
          this.displayedList = res;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  addFeature(): void {
    this._router.navigate(['add'], { relativeTo: this.route });
  }
  openShow(row) {
    this._router.navigate([`${row._id}`], { relativeTo: this.route });
  }
  openEdit(feature) {
    this._router.navigate([`${feature._id}/edit`], { relativeTo: this.route });
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
        this.filterOptions.sortType = null;
        this.filterOptions.sortCode = this.sortCode;
        break;
      case 'sortName':
        if (this.sortName === 'up') {
          this.sortName = 'down';
        } else {
          this.sortName = 'up';
        }
        this.filterOptions.sortCode = null;
        this.filterOptions.sortType = null;
        this.filterOptions.sortName = this.sortName;
        break;
      case 'sortType':
        if (this.sortType === 'up') {
          this.sortType = 'down';
        } else {
          this.sortType = 'up';
        }
        this.filterOptions.sortCode = null;
        this.filterOptions.sortName = null;
        this.filterOptions.sortType = this.sortType;
        break;
      default:
        break;
    }
    this.getList();
  }
  deleteFeature(feature) {
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
        this.featureService.deleteFeature(feature._id).subscribe(() => {
          this.getList();
        });
      }
    });
  }
  refresh(): void {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getList();
    }, this.doneTypingInterval);
  }
}
