import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JoinedTeamsComponent } from '../list/joined-teams.component';
import { JoinedTeamsDetailComponent } from '../detail/joined-teams-detail.component';
import { JoinedTeamsUpdateComponent } from '../update/joined-teams-update.component';
import { JoinedTeamsRoutingResolveService } from './joined-teams-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const joinedTeamsRoute: Routes = [
  {
    path: '',
    component: JoinedTeamsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JoinedTeamsDetailComponent,
    resolve: {
      joinedTeams: JoinedTeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JoinedTeamsUpdateComponent,
    resolve: {
      joinedTeams: JoinedTeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JoinedTeamsUpdateComponent,
    resolve: {
      joinedTeams: JoinedTeamsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(joinedTeamsRoute)],
  exports: [RouterModule],
})
export class JoinedTeamsRoutingModule {}
