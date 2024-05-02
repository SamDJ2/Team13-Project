import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AlcoholComponent } from '../list/alcohol.component';
import { AlcoholDetailComponent } from '../detail/alcohol-detail.component';
import { AlcoholUpdateComponent } from '../update/alcohol-update.component';
import { AlcoholRoutingResolveService } from './alcohol-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const alcoholRoute: Routes = [
  {
    path: '',
    component: AlcoholComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AlcoholDetailComponent,
    resolve: {
      alcohol: AlcoholRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AlcoholUpdateComponent,
    resolve: {
      alcohol: AlcoholRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AlcoholUpdateComponent,
    resolve: {
      alcohol: AlcoholRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(alcoholRoute)],
  exports: [RouterModule],
})
export class AlcoholRoutingModule {}
