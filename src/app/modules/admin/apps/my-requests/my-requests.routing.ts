import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
export const myRequestsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ListComponent,
        data: {
          breadcrumb: 'My requests',
        },
      },
    ],
  },
];
