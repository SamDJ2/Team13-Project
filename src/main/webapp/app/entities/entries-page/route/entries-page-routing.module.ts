import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EntriesPageComponent } from '../list/entries-page.component';
import { EntriesPageDetailComponent } from '../detail/entries-page-detail.component';
import { EntriesPageUpdateComponent } from '../update/entries-page-update.component';
import { EntriesPageRoutingResolveService } from './entries-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const entriesPageRoute: Routes = [
  {
    path: '',
    component: EntriesPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EntriesPageDetailComponent,
    resolve: {
      entriesPage: EntriesPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EntriesPageUpdateComponent,
    resolve: {
      entriesPage: EntriesPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EntriesPageUpdateComponent,
    resolve: {
      entriesPage: EntriesPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(entriesPageRoute)],
  exports: [RouterModule],
})
export class EntriesPageRoutingModule {}
