import { Route } from '@angular/router';
import { StartComponent } from './components/start/start.component';
import { DocsComponent } from './components/docs/docs.component';
import { PricingComponent } from './components/pricing/pricing.component';
import { HomeComponent } from './home.component';

export const homeRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: StartComponent,
        data: {
          breadcrumb: 'start',
        },
      },
      {
        path: 'docs',
        component: DocsComponent,
        data: {
          breadcrumb: 'Docs',
        },
      },
      {
        path: 'pricing',
        component: PricingComponent,
        data: {
          breadcrumb: 'Pricing',
        },
      },
    ],
  },
];
