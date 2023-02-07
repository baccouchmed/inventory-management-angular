import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { DeductComponent } from './deduct/deduct.component';
export const stocksRoutes: Route[] = [
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
      {
        path: 'add',
        component: AddComponent,
        data: {
          breadcrumb: 'Add',
        },
      },
      {
        path: 'deduct',
        component: DeductComponent,
        data: {
          breadcrumb: 'Deduct',
        },
      },
    ],
  },
];
