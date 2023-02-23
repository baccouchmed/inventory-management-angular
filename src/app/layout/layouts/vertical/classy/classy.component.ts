import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import {
  FuseNavigationService,
  FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { TranslocoService } from '@ngneat/transloco';
import { User } from '../../../../shared/models/user';
import { AuthService } from '../../../../shared/services/auth.service';
import { UserService } from '../../../../shared/services/user.service';
import { CompanyService } from '../../../../shared/services/company.service';
import { environment } from '../../../../../environments/environment';
import { MenuService } from '../../../../shared/services/menu.service';
import { Company } from '../../../../shared/models/company';
import { FeatureCodes, listFeatureActions } from '../../../../shared/enums/feature-codes';
import { BadgeService } from 'app/shared/services/badge.service';

@Component({
  selector: 'app-classy-layout',
  templateUrl: './classy.component.html',
  styleUrls: ['./classy.component.scss'],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy {
  isScreenSmall: boolean;
  navigation: any[];
  user: User;
  url = `${environment.api}/public/`;
  urlLogo = `${environment.api}/public/logo/`;
  connectedCompany: Company;
  isLoading: boolean;
  FeatureCodes = FeatureCodes;
  listFeatureCodes = listFeatureActions;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    public userService: UserService,
    private menuService: MenuService,
    private _authService: AuthService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _fuseNavigationService: FuseNavigationService,
    private translateService: TranslocoService,
    private companyService: CompanyService,
    private badgeService: BadgeService,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.isLoading = true;
    // Subscribe to the user service
    this.userService
      .get()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(
        (user: User) => {
          this.user = user;
          this.userService._user.next(this.user);
          this.companyService._company.next(user.companyId);
          this.connectedCompany = user.companyId;
          this.menuService.getMenu().subscribe(
            (data) => {
              this.userService.features = data.features;
              this.navigation = data.menu;
              const codeFeature = this.navigation.map((val) => {
                return val.children.map((el) => el.code);
              });
              const obs = [
                this.badgeService.badgeStocks(),
                this.badgeService.badgeMyRequests(),
                this.badgeService.badgeStockRequests(),
                this.badgeService.badgeStores(),
              ];
              forkJoin(obs).subscribe(
                (result) => {
                  this.badgeService._badgeStock.next(result[0]);
                  this.badgeService._badgeMyRequest.next(result[1]);
                  this.badgeService._badgeStockRequest.next(result[2]);
                  this.badgeService._badgeStore.next(result[3]);
                  for (const [index, group] of codeFeature.entries()) {
                    for (const [index1, feature] of group.entries()) {
                      switch (feature) {
                        case FeatureCodes.stocks:
                          this.navigation[index].children[index1].badge = {
                            title: this.badgeService._badgeStock.getValue(),
                            classes: 'px-2 bg-pink-600 text-white rounded-full',
                          };
                          break;
                        case FeatureCodes.myRequests:
                          this.navigation[index].children[index1].badge = {
                            title: this.badgeService._badgeMyRequest.getValue(),
                            classes: 'px-2 bg-pink-600 text-white rounded-full',
                          };
                          break;
                        case FeatureCodes.otherRequests:
                          this.navigation[index].children[index1].badge = {
                            title: this.badgeService._badgeStockRequest.getValue(),
                            classes: 'px-2 bg-pink-600 text-white rounded-full',
                          };
                          break;
                        case FeatureCodes.store:
                          this.navigation[index].children[index1].badge = {
                            title: this.badgeService._badgeStore.getValue(),
                            classes: 'px-2 bg-pink-600 text-white rounded-full',
                          };
                          break;
                        default:
                          break;
                      }
                    }
                  }
                  this.userService.navigations = this.navigation;
                  this.isLoading = false;
                },
                () => {
                  this.isLoading = false;
                },
              );
            },

            () => {
              this.isLoading = false;
            },
          );
        },
        () => {
          this.isLoading = false;
        },
      );

    // Subscribe to media changes
    this._fuseMediaWatcherService.onMediaChange$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ matchingAliases }) => {
        // Check if the screen is small
        this.isScreenSmall = !matchingAliases.includes('md');
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleNavigation(name: string): void {
    // Get the navigation
    const navigation =
      this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

    if (navigation) {
      // Toggle the opened status
      navigation.toggle();
    }
  }

  logout(): void {
    this._router.navigate(['sign-out']);
  }

  refreshCompany(): void {
    this.connectedCompany = this.companyService._company.getValue();
  }
}
