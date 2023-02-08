import { Route } from '@angular/router';
import { IsAuthorizedGuard } from 'app/core/auth/guards/isAuthorized.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { FeatureCodes } from './shared/enums/feature-codes';
import { AuthGuard } from './core/auth/guards/auth.guard';
// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [
  // Redirect empty path to '/example'
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home/profile',
  },

  // Redirect signed in user to the '/example'
  //
  // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
  // path. Below is another redirection for that path to redirect the user to the desired
  // location. This is a small convenience to keep all main routes together here on this file.
  {
    path: 'signed-in-redirect',
    pathMatch: 'full',
    redirectTo: 'home/profile',
  },

  // Auth routes for guests
  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('app/modules/auth/forgot-password/forgot-password.module').then(
            (m) => m.AuthForgotPasswordModule,
          ),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('app/modules/auth/reset-password/reset-password.module').then(
            (m) => m.AuthResetPasswordModule,
          ),
      },
      {
        path: 'sign-in',
        loadChildren: () =>
          import('app/modules/auth/sign-in/sign-in.module').then((m) => m.AuthSignInModule),
      },
      {
        path: 'confirmation-required',
        loadChildren: () =>
          import('app/modules/auth/confirmation-required/confirmation-required.module').then(
            (m) => m.AuthConfirmationRequiredModule,
          ),
      },
    ],
  },

  // Auth routes for authenticated users
  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () =>
          import('app/modules/auth/sign-out/sign-out.module').then((m) => m.AuthSignOutModule),
      },
      {
        path: 'unlock-session',
        loadChildren: () =>
          import('app/modules/auth/unlock-session/unlock-session.module').then(
            (m) => m.AuthUnlockSessionModule,
          ),
      },
    ],
  },

  // Admin routes
  {
    path: '',
    component: LayoutComponent,
    children: [
      // home
      {
        path: 'home',
        data: {
          breadcrumb: {
            label: 'Home',
            info: { myData: { icon: 'home', iconType: 'material' } },
          },
        },
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'companies',
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            data: {
              breadcrumb: 'Companies',
              feature: FeatureCodes.company,
            },
            path: 'companies',
            loadChildren: () =>
              import('app/modules/admin/apps/companies/companies.module').then(
                (m) => m.CompaniesModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            data: {
              breadcrumb: 'Companies products',
              feature: FeatureCodes.companyProduct,
            },
            path: 'companiesproducts',
            loadChildren: () =>
              import('app/modules/admin/apps/company-product/company-product.module').then(
                (m) => m.CompanyProductModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            data: {
              breadcrumb: 'type product',
              feature: FeatureCodes.typeProduct,
            },
            path: 'typesproducts',
            loadChildren: () =>
              import('app/modules/admin/apps/type-product/type-product.module').then(
                (m) => m.TypeProductModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'features',
            data: {
              breadcrumb: 'Features',
              feature: FeatureCodes.features,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/features/features.module').then(
                (m) => m.FeaturesModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'paramprojects',
            data: {
              breadcrumb: 'ParamProjects',
              feature: FeatureCodes.paramProject,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/paramProjects/paramProjects.module').then(
                (m) => m.ParamProjectsModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'groups',
            data: {
              breadcrumb: 'Groups',
              feature: FeatureCodes.groups,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/groups/groups.module').then((m) => m.GroupsModule),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'userfeatures',
            data: {
              breadcrumb: 'User features',
              feature: FeatureCodes.userFeatures,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/user-features/user-features.module').then(
                (m) => m.UserFeaturesModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'users',
            data: {
              breadcrumb: 'Users',
              feature: FeatureCodes.users,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/users/users.module').then((m) => m.UsersModule),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'products',
            data: {
              breadcrumb: 'Products',
              feature: FeatureCodes.products,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/products/products.module').then(
                (m) => m.ProductsModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'stocks',
            data: {
              breadcrumb: 'Stocks',
              feature: FeatureCodes.products,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/stocks/stocks.module').then((m) => m.StocksModule),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'store',
            data: {
              breadcrumb: 'Store',
              feature: FeatureCodes.store,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/store/store.module').then((m) => m.StoreModule),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'countries',
            data: {
              breadcrumb: 'Countries',
              feature: FeatureCodes.countries,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/countries/countries.module').then(
                (m) => m.CountriesModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'thirdparty',
            data: {
              breadcrumb: 'Third Party',
              feature: FeatureCodes.thirdParty,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/thirdparty/thirdparty.module').then(
                (m) => m.ThirdpartyModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'typethirdparty',
            data: {
              breadcrumb: 'Third Party Type',
              feature: FeatureCodes.thirdPartyType,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/typethirdparty/typethirdparty.module').then(
                (m) => m.TypethirdpartyModule,
              ),
          },
          {
            canActivate: [IsAuthorizedGuard],
            canActivateChild: [IsAuthorizedGuard],
            path: 'contracts',
            data: {
              breadcrumb: 'Contracts',
              feature: FeatureCodes.contracts,
            },
            loadChildren: () =>
              import('app/modules/admin/apps/contracts/contracts.module').then(
                (m) => m.ContractsModule,
              ),
          },
          {
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
            path: 'profile',
            data: {
              breadcrumb: 'Profile',
              feature: FeatureCodes.profile,
            },
            loadChildren: () =>
              import('app/modules/admin/pages/settings/settings.module').then(
                (m) => m.SettingsModule,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
