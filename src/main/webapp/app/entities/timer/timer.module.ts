import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TimerComponent } from './list/timer.component';
import { TimerDetailComponent } from './detail/timer-detail.component';
import { TimerUpdateComponent } from './update/timer-update.component';
import { TimerDeleteDialogComponent } from './delete/timer-delete-dialog.component';
import { TimerRoutingModule } from './route/timer-routing.module';

@NgModule({
  imports: [SharedModule, TimerRoutingModule],
  declarations: [TimerComponent, TimerDetailComponent, TimerUpdateComponent, TimerDeleteDialogComponent],
})
export class TimerModule {}
