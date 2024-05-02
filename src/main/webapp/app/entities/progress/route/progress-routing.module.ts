import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProgressComponent } from '../list/progress.component';
import { ProgressDetailComponent } from '../detail/progress-detail.component';
import { ProgressUpdateComponent } from '../update/progress-update.component';
import { ProgressRoutingResolveService } from './progress-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const progressRoute: Routes = [
  {
    path: '',
    component: ProgressComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProgressDetailComponent,
    resolve: {
      progress: ProgressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProgressUpdateComponent,
    resolve: {
      progress: ProgressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProgressUpdateComponent,
    resolve: {
      progress: ProgressRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(progressRoute)],
  exports: [RouterModule],
})
export class ProgressRoutingModule {}
