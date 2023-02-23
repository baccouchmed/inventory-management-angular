import { Route } from '@angular/router';
import { ListComponent } from './list/list.component';
export const otherRequestsRoutes: Route[] = [
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
