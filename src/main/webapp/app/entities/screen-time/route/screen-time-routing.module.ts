import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ScreenTimeComponent } from '../list/screen-time.component';
import { ScreenTimeDetailComponent } from '../detail/screen-time-detail.component';
import { ScreenTimeUpdateComponent } from '../update/screen-time-update.component';
import { ScreenTimeRoutingResolveService } from './screen-time-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const screenTimeRoute: Routes = [
  {
    path: '',
    component: ScreenTimeComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ScreenTimeDetailComponent,
    resolve: {
      screenTime: ScreenTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ScreenTimeUpdateComponent,
    resolve: {
      screenTime: ScreenTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ScreenTimeUpdateComponent,
    resolve: {
      screenTime: ScreenTimeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(screenTimeRoute)],
  exports: [RouterModule],
})
export class ScreenTimeRoutingModule {}
