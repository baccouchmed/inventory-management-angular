import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
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
      {
        path: 'add',
        component: AddComponent,
        data: {
          breadcrumb: 'Add',
        },
      },
    ],
  },
];
