import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WeeklySummaryComponent } from '../list/weekly-summary.component';
import { WeeklySummaryDetailComponent } from '../detail/weekly-summary-detail.component';
import { WeeklySummaryUpdateComponent } from '../update/weekly-summary-update.component';
import { WeeklySummaryRoutingResolveService } from './weekly-summary-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const weeklySummaryRoute: Routes = [
  {
    path: '',
    component: WeeklySummaryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeeklySummaryDetailComponent,
    resolve: {
      weeklySummary: WeeklySummaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeeklySummaryUpdateComponent,
    resolve: {
      weeklySummary: WeeklySummaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeeklySummaryUpdateComponent,
    resolve: {
      weeklySummary: WeeklySummaryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(weeklySummaryRoute)],
  exports: [RouterModule],
})
export class WeeklySummaryRoutingModule {}
