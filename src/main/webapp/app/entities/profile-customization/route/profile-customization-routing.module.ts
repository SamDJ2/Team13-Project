import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProfileCustomizationComponent } from '../list/profile-customization.component';
import { ProfileCustomizationDetailComponent } from '../detail/profile-customization-detail.component';
import { ProfileCustomizationUpdateComponent } from '../update/profile-customization-update.component';
import { ProfileCustomizationRoutingResolveService } from './profile-customization-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const profileCustomizationRoute: Routes = [
  {
    path: '',
    component: ProfileCustomizationComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProfileCustomizationDetailComponent,
    resolve: {
      profileCustomization: ProfileCustomizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProfileCustomizationUpdateComponent,
    resolve: {
      profileCustomization: ProfileCustomizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProfileCustomizationUpdateComponent,
    resolve: {
      profileCustomization: ProfileCustomizationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(profileCustomizationRoute)],
  exports: [RouterModule],
})
export class ProfileCustomizationRoutingModule {}
