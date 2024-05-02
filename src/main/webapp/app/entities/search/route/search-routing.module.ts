import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SearchComponent } from '../list/search.component';
import { SearchDetailComponent } from '../detail/search-detail.component';
import { SearchUpdateComponent } from '../update/search-update.component';
import { SearchRoutingResolveService } from './search-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const searchRoute: Routes = [
  {
    path: '',
    component: SearchComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SearchDetailComponent,
    resolve: {
      search: SearchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SearchUpdateComponent,
    resolve: {
      search: SearchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SearchUpdateComponent,
    resolve: {
      search: SearchRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(searchRoute)],
  exports: [RouterModule],
})
export class SearchRoutingModule {}
