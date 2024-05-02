import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MoodJournalPageComponent } from './list/mood-journal-page.component';
import { MoodJournalPageDetailComponent } from './detail/mood-journal-page-detail.component';
import { MoodJournalPageUpdateComponent } from './update/mood-journal-page-update.component';
import { MoodJournalPageDeleteDialogComponent } from './delete/mood-journal-page-delete-dialog.component';
import { MoodJournalPageRoutingModule } from './route/mood-journal-page-routing.module';

@NgModule({
  imports: [SharedModule, MoodJournalPageRoutingModule],
  declarations: [
    MoodJournalPageComponent,
    MoodJournalPageDetailComponent,
    MoodJournalPageUpdateComponent,
    MoodJournalPageDeleteDialogComponent,
  ],
})
export class MoodJournalPageModule {}
