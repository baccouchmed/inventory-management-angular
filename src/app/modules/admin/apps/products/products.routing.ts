import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
export const productsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          breadcrumb: 'Products',
        },
      },
    ],
  },
];
