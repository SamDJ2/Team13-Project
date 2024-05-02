import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HabitstrackingComponent } from '../list/habitstracking.component';
import { HabitstrackingDetailComponent } from '../detail/habitstracking-detail.component';
import { HabitstrackingUpdateComponent } from '../update/habitstracking-update.component';
import { HabitstrackingRoutingResolveService } from './habitstracking-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const habitstrackingRoute: Routes = [
  {
    path: '',
    component: HabitstrackingComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HabitstrackingDetailComponent,
    resolve: {
      habitstracking: HabitstrackingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HabitstrackingUpdateComponent,
    resolve: {
      habitstracking: HabitstrackingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HabitstrackingUpdateComponent,
    resolve: {
      habitstracking: HabitstrackingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(habitstrackingRoute)],
  exports: [RouterModule],
})
export class HabitstrackingRoutingModule {}
