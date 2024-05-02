import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HabitstrackingComponent } from './list/habitstracking.component';
import { HabitstrackingDetailComponent } from './detail/habitstracking-detail.component';
import { HabitstrackingUpdateComponent } from './update/habitstracking-update.component';
import { HabitstrackingDeleteDialogComponent } from './delete/habitstracking-delete-dialog.component';
import { HabitstrackingRoutingModule } from './route/habitstracking-routing.module';

@NgModule({
  imports: [SharedModule, HabitstrackingRoutingModule],
  declarations: [
    HabitstrackingComponent,
    HabitstrackingDetailComponent,
    HabitstrackingUpdateComponent,
    HabitstrackingDeleteDialogComponent,
  ],
})
export class HabitstrackingModule {}
