import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NewWeeklyHabitTrackerComponent } from '../list/new-weekly-habit-tracker.component';
import { NewWeeklyHabitTrackerDetailComponent } from '../detail/new-weekly-habit-tracker-detail.component';
import { NewWeeklyHabitTrackerUpdateComponent } from '../update/new-weekly-habit-tracker-update.component';
import { NewWeeklyHabitTrackerRoutingResolveService } from './new-weekly-habit-tracker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const newWeeklyHabitTrackerRoute: Routes = [
  {
    path: '',
    component: NewWeeklyHabitTrackerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NewWeeklyHabitTrackerDetailComponent,
    resolve: {
      newWeeklyHabitTracker: NewWeeklyHabitTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NewWeeklyHabitTrackerUpdateComponent,
    resolve: {
      newWeeklyHabitTracker: NewWeeklyHabitTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NewWeeklyHabitTrackerUpdateComponent,
    resolve: {
      newWeeklyHabitTracker: NewWeeklyHabitTrackerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(newWeeklyHabitTrackerRoute)],
  exports: [RouterModule],
})
export class NewWeeklyHabitTrackerRoutingModule {}
