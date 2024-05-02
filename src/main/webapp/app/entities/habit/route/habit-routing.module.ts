import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HabitComponent } from '../list/habit.component';
import { HabitDetailComponent } from '../detail/habit-detail.component';
import { HabitUpdateComponent } from '../update/habit-update.component';
import { HabitRoutingResolveService } from './habit-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const habitRoute: Routes = [
  {
    path: '',
    component: HabitComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HabitDetailComponent,
    resolve: {
      habit: HabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HabitUpdateComponent,
    resolve: {
      habit: HabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HabitUpdateComponent,
    resolve: {
      habit: HabitRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(habitRoute)],
  exports: [RouterModule],
})
export class HabitRoutingModule {}
