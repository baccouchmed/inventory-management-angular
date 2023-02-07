import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
export const shopRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          breadcrumb: 'Stocks',
        },
      },
    ],
  },
];
