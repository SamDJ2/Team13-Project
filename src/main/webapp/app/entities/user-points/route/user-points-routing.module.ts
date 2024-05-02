import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserPointsComponent } from '../list/user-points.component';
import { UserPointsDetailComponent } from '../detail/user-points-detail.component';
import { UserPointsUpdateComponent } from '../update/user-points-update.component';
import { UserPointsRoutingResolveService } from './user-points-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userPointsRoute: Routes = [
  {
    path: '',
    component: UserPointsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserPointsDetailComponent,
    resolve: {
      userPoints: UserPointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserPointsUpdateComponent,
    resolve: {
      userPoints: UserPointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserPointsUpdateComponent,
    resolve: {
      userPoints: UserPointsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userPointsRoute)],
  exports: [RouterModule],
})
export class UserPointsRoutingModule {}
