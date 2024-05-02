import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ScreenTimeComponent } from './list/screen-time.component';
import { ScreenTimeDetailComponent } from './detail/screen-time-detail.component';
import { ScreenTimeUpdateComponent } from './update/screen-time-update.component';
import { ScreenTimeDeleteDialogComponent } from './delete/screen-time-delete-dialog.component';
import { ScreenTimeRoutingModule } from './route/screen-time-routing.module';

@NgModule({
  imports: [SharedModule, ScreenTimeRoutingModule],
  declarations: [ScreenTimeComponent, ScreenTimeDetailComponent, ScreenTimeUpdateComponent, ScreenTimeDeleteDialogComponent],
})
export class ScreenTimeModule {}
