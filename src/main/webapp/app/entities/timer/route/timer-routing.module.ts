import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TimerComponent } from '../list/timer.component';
import { TimerDetailComponent } from '../detail/timer-detail.component';
import { TimerUpdateComponent } from '../update/timer-update.component';
import { TimerRoutingResolveService } from './timer-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const timerRoute: Routes = [
  {
    path: '',
    component: TimerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TimerDetailComponent,
    resolve: {
      timer: TimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TimerUpdateComponent,
    resolve: {
      timer: TimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TimerUpdateComponent,
    resolve: {
      timer: TimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(timerRoute)],
  exports: [RouterModule],
})
export class TimerRoutingModule {}
