import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GroupingComponent } from '../list/grouping.component';
import { GroupingDetailComponent } from '../detail/grouping-detail.component';
import { GroupingUpdateComponent } from '../update/grouping-update.component';
import { GroupingRoutingResolveService } from './grouping-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const groupingRoute: Routes = [
  {
    path: '',
    component: GroupingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GroupingDetailComponent,
    resolve: {
      grouping: GroupingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GroupingUpdateComponent,
    resolve: {
      grouping: GroupingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GroupingUpdateComponent,
    resolve: {
      grouping: GroupingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(groupingRoute)],
  exports: [RouterModule],
})
export class GroupingRoutingModule {}
