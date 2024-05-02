import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HabitComponent } from './list/habit.component';
import { HabitDetailComponent } from './detail/habit-detail.component';
import { HabitUpdateComponent } from './update/habit-update.component';
import { HabitDeleteDialogComponent } from './delete/habit-delete-dialog.component';
import { HabitRoutingModule } from './route/habit-routing.module';

@NgModule({
  imports: [SharedModule, HabitRoutingModule],
  declarations: [HabitComponent, HabitDetailComponent, HabitUpdateComponent, HabitDeleteDialogComponent],
})
export class HabitModule {}
