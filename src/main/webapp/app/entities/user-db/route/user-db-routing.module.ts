import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { UserDBComponent } from '../list/user-db.component';
import { UserDBDetailComponent } from '../detail/user-db-detail.component';
import { UserDBUpdateComponent } from '../update/user-db-update.component';
import { UserDBRoutingResolveService } from './user-db-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const userDBRoute: Routes = [
  {
    path: '',
    component: UserDBComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserDBDetailComponent,
    resolve: {
      userDB: UserDBRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserDBUpdateComponent,
    resolve: {
      userDB: UserDBRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserDBUpdateComponent,
    resolve: {
      userDB: UserDBRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(userDBRoute)],
  exports: [RouterModule],
})
export class UserDBRoutingModule {}
