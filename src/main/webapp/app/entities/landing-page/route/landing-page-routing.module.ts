import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandingPageComponent } from '../list/landing-page.component';
import { LandingPageDetailComponent } from '../detail/landing-page-detail.component';
import { LandingPageUpdateComponent } from '../update/landing-page-update.component';
import { LandingPageRoutingResolveService } from './landing-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const landingPageRoute: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandingPageDetailComponent,
    resolve: {
      landingPage: LandingPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandingPageUpdateComponent,
    resolve: {
      landingPage: LandingPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandingPageUpdateComponent,
    resolve: {
      landingPage: LandingPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landingPageRoute)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
