import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SocialMediaComponent } from '../list/social-media.component';
import { SocialMediaDetailComponent } from '../detail/social-media-detail.component';
import { SocialMediaUpdateComponent } from '../update/social-media-update.component';
import { SocialMediaRoutingResolveService } from './social-media-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const socialMediaRoute: Routes = [
  {
    path: '',
    component: SocialMediaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SocialMediaDetailComponent,
    resolve: {
      socialMedia: SocialMediaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SocialMediaUpdateComponent,
    resolve: {
      socialMedia: SocialMediaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SocialMediaUpdateComponent,
    resolve: {
      socialMedia: SocialMediaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(socialMediaRoute)],
  exports: [RouterModule],
})
export class SocialMediaRoutingModule {}
