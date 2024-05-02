import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AchievementComponent } from '../list/achievement.component';
import { AchievementDetailComponent } from '../detail/achievement-detail.component';
import { AchievementUpdateComponent } from '../update/achievement-update.component';
import { AchievementRoutingResolveService } from './achievement-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const achievementRoute: Routes = [
  {
    path: '',
    component: AchievementComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AchievementDetailComponent,
    resolve: {
      achievement: AchievementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AchievementUpdateComponent,
    resolve: {
      achievement: AchievementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AchievementUpdateComponent,
    resolve: {
      achievement: AchievementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(achievementRoute)],
  exports: [RouterModule],
})
export class AchievementRoutingModule {}
