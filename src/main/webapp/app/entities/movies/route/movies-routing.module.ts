import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoviesComponent } from '../list/movies.component';
import { MoviesDetailComponent } from '../detail/movies-detail.component';
import { MoviesUpdateComponent } from '../update/movies-update.component';
import { MoviesRoutingResolveService } from './movies-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moviesRoute: Routes = [
  {
    path: '',
    component: MoviesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoviesDetailComponent,
    resolve: {
      movies: MoviesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoviesUpdateComponent,
    resolve: {
      movies: MoviesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoviesUpdateComponent,
    resolve: {
      movies: MoviesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moviesRoute)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
