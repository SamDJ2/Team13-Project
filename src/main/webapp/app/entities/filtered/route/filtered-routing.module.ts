import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { FilteredComponent } from '../list/filtered.component';
import { FilteredDetailComponent } from '../detail/filtered-detail.component';
import { FilteredUpdateComponent } from '../update/filtered-update.component';
import { FilteredRoutingResolveService } from './filtered-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const filteredRoute: Routes = [
  {
    path: '',
    component: FilteredComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FilteredDetailComponent,
    resolve: {
      filtered: FilteredRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FilteredUpdateComponent,
    resolve: {
      filtered: FilteredRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FilteredUpdateComponent,
    resolve: {
      filtered: FilteredRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(filteredRoute)],
  exports: [RouterModule],
})
export class FilteredRoutingModule {}
