import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EmotionPageComponent } from '../list/emotion-page.component';
import { EmotionPageDetailComponent } from '../detail/emotion-page-detail.component';
import { EmotionPageUpdateComponent } from '../update/emotion-page-update.component';
import { EmotionPageRoutingResolveService } from './emotion-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const emotionPageRoute: Routes = [
  {
    path: '',
    component: EmotionPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EmotionPageDetailComponent,
    resolve: {
      emotionPage: EmotionPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EmotionPageUpdateComponent,
    resolve: {
      emotionPage: EmotionPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EmotionPageUpdateComponent,
    resolve: {
      emotionPage: EmotionPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(emotionPageRoute)],
  exports: [RouterModule],
})
export class EmotionPageRoutingModule {}
