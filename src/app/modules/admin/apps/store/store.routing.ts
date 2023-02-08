import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
export const storeRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          breadcrumb: 'Store',
        },
      },
    ],
  },
];
