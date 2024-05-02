import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoodPickerComponent } from '../list/mood-picker.component';
import { MoodPickerDetailComponent } from '../detail/mood-picker-detail.component';
import { MoodPickerUpdateComponent } from '../update/mood-picker-update.component';
import { MoodPickerRoutingResolveService } from './mood-picker-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moodPickerRoute: Routes = [
  {
    path: '',
    component: MoodPickerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoodPickerDetailComponent,
    resolve: {
      moodPicker: MoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoodPickerUpdateComponent,
    resolve: {
      moodPicker: MoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoodPickerUpdateComponent,
    resolve: {
      moodPicker: MoodPickerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moodPickerRoute)],
  exports: [RouterModule],
})
export class MoodPickerRoutingModule {}
