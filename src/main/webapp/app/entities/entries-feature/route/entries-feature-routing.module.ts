import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntriesFeatureComponent } from '../list/entries-feature.component';
import { EntriesFeatureDetailComponent } from '../detail/entries-feature-detail.component';
import { EntriesFeatureUpdateComponent } from '../update/entries-feature-update.component';
import { EntriesFeatureRoutingResolveService } from './entries-feature-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const entriesFeatureRoute: Routes = [
  {
    path: '',
    component: EntriesFeatureComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntriesFeatureDetailComponent,
    resolve: {
      entriesFeature: EntriesFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntriesFeatureUpdateComponent,
    resolve: {
      entriesFeature: EntriesFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntriesFeatureUpdateComponent,
    resolve: {
      entriesFeature: EntriesFeatureRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entriesFeatureRoute)],
  exports: [RouterModule],
})
export class EntriesFeatureRoutingModule {}
