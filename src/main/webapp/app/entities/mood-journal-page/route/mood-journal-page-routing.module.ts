import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MoodJournalPageComponent } from '../list/mood-journal-page.component';
import { MoodJournalPageDetailComponent } from '../detail/mood-journal-page-detail.component';
import { MoodJournalPageUpdateComponent } from '../update/mood-journal-page-update.component';
import { MoodJournalPageRoutingResolveService } from './mood-journal-page-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const moodJournalPageRoute: Routes = [
  {
    path: '',
    component: MoodJournalPageComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MoodJournalPageDetailComponent,
    resolve: {
      moodJournalPage: MoodJournalPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MoodJournalPageUpdateComponent,
    resolve: {
      moodJournalPage: MoodJournalPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MoodJournalPageUpdateComponent,
    resolve: {
      moodJournalPage: MoodJournalPageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(moodJournalPageRoute)],
  exports: [RouterModule],
})
export class MoodJournalPageRoutingModule {}
