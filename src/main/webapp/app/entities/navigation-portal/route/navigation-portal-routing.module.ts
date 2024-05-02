import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NavigationPortalComponent } from '../list/navigation-portal.component';
import { NavigationPortalDetailComponent } from '../detail/navigation-portal-detail.component';
import { NavigationPortalUpdateComponent } from '../update/navigation-portal-update.component';
import { NavigationPortalRoutingResolveService } from './navigation-portal-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const navigationPortalRoute: Routes = [
  {
    path: '',
    component: NavigationPortalComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NavigationPortalDetailComponent,
    resolve: {
      navigationPortal: NavigationPortalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NavigationPortalUpdateComponent,
    resolve: {
      navigationPortal: NavigationPortalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NavigationPortalUpdateComponent,
    resolve: {
      navigationPortal: NavigationPortalRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(navigationPortalRoute)],
  exports: [RouterModule],
})
export class NavigationPortalRoutingModule {}
