import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PromptsFeatureComponent } from '../list/prompts-feature.component';
import { PromptsFeatureDetailComponent } from '../detail/prompts-feature-detail.component';
import { PromptsFeatureUpdateComponent } from '../update/prompts-feature-update.component';
import { PromptsFeatureRoutingResolveService } from './prompts-feature-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const promptsFeatureRoute: Routes = [
  {
    path: '',
    component: PromptsFeatureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PromptsFeatureDetailComponent,
    resolve: {
      promptsFeature: PromptsFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PromptsFeatureUpdateComponent,
    resolve: {
      promptsFeature: PromptsFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PromptsFeatureUpdateComponent,
    resolve: {
      promptsFeature: PromptsFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(promptsFeatureRoute)],
  exports: [RouterModule],
})
export class PromptsFeatureRoutingModule {}
