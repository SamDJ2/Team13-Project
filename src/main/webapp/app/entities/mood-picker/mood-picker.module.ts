import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MoodPickerComponent } from './list/mood-picker.component';
import { MoodPickerDetailComponent } from './detail/mood-picker-detail.component';
import { MoodPickerUpdateComponent } from './update/mood-picker-update.component';
import { MoodPickerDeleteDialogComponent } from './delete/mood-picker-delete-dialog.component';
import { MoodPickerRoutingModule } from './route/mood-picker-routing.module';

@NgModule({
  imports: [SharedModule, MoodPickerRoutingModule],
  declarations: [MoodPickerComponent, MoodPickerDetailComponent, MoodPickerUpdateComponent, MoodPickerDeleteDialogComponent],
})
export class MoodPickerModule {}
