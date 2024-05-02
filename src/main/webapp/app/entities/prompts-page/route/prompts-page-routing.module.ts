import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PromptsPageComponent } from '../list/prompts-page.component';
import { PromptsPageDetailComponent } from '../detail/prompts-page-detail.component';
import { PromptsPageUpdateComponent } from '../update/prompts-page-update.component';
import { PromptsPageRoutingResolveService } from './prompts-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const promptsPageRoute: Routes = [
  {
    path: '',
    component: PromptsPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PromptsPageDetailComponent,
    resolve: {
      promptsPage: PromptsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PromptsPageUpdateComponent,
    resolve: {
      promptsPage: PromptsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PromptsPageUpdateComponent,
    resolve: {
      promptsPage: PromptsPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(promptsPageRoute)],
  exports: [RouterModule],
})
export class PromptsPageRoutingModule {}
