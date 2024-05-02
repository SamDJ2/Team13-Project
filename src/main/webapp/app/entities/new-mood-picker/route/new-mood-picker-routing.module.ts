import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NewMoodPickerComponent } from '../list/new-mood-picker.component';
import { NewMoodPickerDetailComponent } from '../detail/new-mood-picker-detail.component';
import { NewMoodPickerUpdateComponent } from '../update/new-mood-picker-update.component';
import { NewMoodPickerRoutingResolveService } from './new-mood-picker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const newMoodPickerRoute: Routes = [
  {
    path: '',
    component: NewMoodPickerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NewMoodPickerDetailComponent,
    resolve: {
      newMoodPicker: NewMoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NewMoodPickerUpdateComponent,
    resolve: {
      newMoodPicker: NewMoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NewMoodPickerUpdateComponent,
    resolve: {
      newMoodPicker: NewMoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(newMoodPickerRoute)],
  exports: [RouterModule],
})
export class NewMoodPickerRoutingModule {}
