import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VideoGamesComponent } from '../list/video-games.component';
import { VideoGamesDetailComponent } from '../detail/video-games-detail.component';
import { VideoGamesUpdateComponent } from '../update/video-games-update.component';
import { VideoGamesRoutingResolveService } from './video-games-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const videoGamesRoute: Routes = [
  {
    path: '',
    component: VideoGamesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VideoGamesDetailComponent,
    resolve: {
      videoGames: VideoGamesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VideoGamesUpdateComponent,
    resolve: {
      videoGames: VideoGamesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VideoGamesUpdateComponent,
    resolve: {
      videoGames: VideoGamesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(videoGamesRoute)],
  exports: [RouterModule],
})
export class VideoGamesRoutingModule {}
