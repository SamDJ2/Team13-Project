import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MembersComponent } from '../list/members.component';
import { MembersDetailComponent } from '../detail/members-detail.component';
import { MembersUpdateComponent } from '../update/members-update.component';
import { MembersRoutingResolveService } from './members-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const membersRoute: Routes = [
  {
    path: '',
    component: MembersComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MembersDetailComponent,
    resolve: {
      members: MembersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MembersUpdateComponent,
    resolve: {
      members: MembersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MembersUpdateComponent,
    resolve: {
      members: MembersRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(membersRoute)],
  exports: [RouterModule],
})
export class MembersRoutingModule {}
