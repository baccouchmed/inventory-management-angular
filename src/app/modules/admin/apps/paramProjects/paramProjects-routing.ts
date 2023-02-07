import { Route } from '@angular/router';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './details/components/edit/edit.component';

export const groupsRoutes: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: DetailsComponent,
        data: {
          breadcrumb: 'ParamProjects',
        },
      },
      {
        path: 'edit',
        component: EditComponent,
        data: {
          breadcrumb: 'Edit',
        },
      },
    ],
  },
];
