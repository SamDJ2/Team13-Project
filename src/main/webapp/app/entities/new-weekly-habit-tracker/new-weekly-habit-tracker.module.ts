import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NewWeeklyHabitTrackerComponent } from './list/new-weekly-habit-tracker.component';
import { NewWeeklyHabitTrackerDetailComponent } from './detail/new-weekly-habit-tracker-detail.component';
import { NewWeeklyHabitTrackerUpdateComponent } from './update/new-weekly-habit-tracker-update.component';
import { NewWeeklyHabitTrackerDeleteDialogComponent } from './delete/new-weekly-habit-tracker-delete-dialog.component';
import { NewWeeklyHabitTrackerRoutingModule } from './route/new-weekly-habit-tracker-routing.module';

@NgModule({
  imports: [SharedModule, NewWeeklyHabitTrackerRoutingModule],
  declarations: [
    NewWeeklyHabitTrackerComponent,
    NewWeeklyHabitTrackerDetailComponent,
    NewWeeklyHabitTrackerUpdateComponent,
    NewWeeklyHabitTrackerDeleteDialogComponent,
  ],
})
export class NewWeeklyHabitTrackerModule {}
