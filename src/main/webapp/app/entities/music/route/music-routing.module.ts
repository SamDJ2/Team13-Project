import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MusicComponent } from '../list/music.component';
import { MusicDetailComponent } from '../detail/music-detail.component';
import { MusicUpdateComponent } from '../update/music-update.component';
import { MusicRoutingResolveService } from './music-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const musicRoute: Routes = [
  {
    path: '',
    component: MusicComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MusicDetailComponent,
    resolve: {
      music: MusicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MusicUpdateComponent,
    resolve: {
      music: MusicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MusicUpdateComponent,
    resolve: {
      music: MusicRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(musicRoute)],
  exports: [RouterModule],
})
export class MusicRoutingModule {}
