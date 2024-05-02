import { Route } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const HOME_ROUTE: Route = {
  path: '',
  component: DashboardComponent,
  data: {
    pageTitle: 'Dashboard',
  },
};
