import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { JunkFoodComponent } from '../list/junk-food.component';
import { JunkFoodDetailComponent } from '../detail/junk-food-detail.component';
import { JunkFoodUpdateComponent } from '../update/junk-food-update.component';
import { JunkFoodRoutingResolveService } from './junk-food-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const junkFoodRoute: Routes = [
  {
    path: '',
    component: JunkFoodComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: JunkFoodDetailComponent,
    resolve: {
      junkFood: JunkFoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: JunkFoodUpdateComponent,
    resolve: {
      junkFood: JunkFoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: JunkFoodUpdateComponent,
    resolve: {
      junkFood: JunkFoodRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(junkFoodRoute)],
  exports: [RouterModule],
})
export class JunkFoodRoutingModule {}
