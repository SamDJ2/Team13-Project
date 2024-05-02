import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { BadgesComponent } from '../list/badges.component';
import { BadgesDetailComponent } from '../detail/badges-detail.component';
import { BadgesUpdateComponent } from '../update/badges-update.component';
import { BadgesRoutingResolveService } from './badges-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const badgesRoute: Routes = [
  {
    path: '',
    component: BadgesComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BadgesDetailComponent,
    resolve: {
      badges: BadgesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BadgesUpdateComponent,
    resolve: {
      badges: BadgesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BadgesUpdateComponent,
    resolve: {
      badges: BadgesRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(badgesRoute)],
  exports: [RouterModule],
})
export class BadgesRoutingModule {}
