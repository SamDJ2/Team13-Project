import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeaderBoardsComponent } from '../list/leader-boards.component';
import { LeaderBoardsDetailComponent } from '../detail/leader-boards-detail.component';
import { LeaderBoardsUpdateComponent } from '../update/leader-boards-update.component';
import { LeaderBoardsRoutingResolveService } from './leader-boards-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const leaderBoardsRoute: Routes = [
  {
    path: '',
    component: LeaderBoardsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeaderBoardsDetailComponent,
    resolve: {
      leaderBoards: LeaderBoardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeaderBoardsUpdateComponent,
    resolve: {
      leaderBoards: LeaderBoardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeaderBoardsUpdateComponent,
    resolve: {
      leaderBoards: LeaderBoardsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaderBoardsRoute)],
  exports: [RouterModule],
})
export class LeaderBoardsRoutingModule {}
