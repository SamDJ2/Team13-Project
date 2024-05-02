import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SmokingComponent } from '../list/smoking.component';
import { SmokingDetailComponent } from '../detail/smoking-detail.component';
import { SmokingUpdateComponent } from '../update/smoking-update.component';
import { SmokingRoutingResolveService } from './smoking-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const smokingRoute: Routes = [
  {
    path: '',
    component: SmokingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SmokingDetailComponent,
    resolve: {
      smoking: SmokingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SmokingUpdateComponent,
    resolve: {
      smoking: SmokingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SmokingUpdateComponent,
    resolve: {
      smoking: SmokingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(smokingRoute)],
  exports: [RouterModule],
})
export class SmokingRoutingModule {}
