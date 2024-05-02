import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ChallengesComponent } from '../list/challenges.component';
import { ChallengesDetailComponent } from '../detail/challenges-detail.component';
import { ChallengesUpdateComponent } from '../update/challenges-update.component';
import { ChallengesRoutingResolveService } from './challenges-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const challengesRoute: Routes = [
  {
    path: '',
    component: ChallengesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ChallengesDetailComponent,
    resolve: {
      challenges: ChallengesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ChallengesUpdateComponent,
    resolve: {
      challenges: ChallengesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ChallengesUpdateComponent,
    resolve: {
      challenges: ChallengesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(challengesRoute)],
  exports: [RouterModule],
})
export class ChallengesRoutingModule {}
