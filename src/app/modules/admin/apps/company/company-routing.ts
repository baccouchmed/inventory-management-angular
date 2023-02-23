import { Route } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';

export const companyRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DetailsComponent,
        data: {
          breadcrumb: 'Company',
        },
      },
      {
        path: '',
        children: [
          {
            path: 'edit',
            component: EditComponent,
          },
        ],
      },
    ],
  },
];
