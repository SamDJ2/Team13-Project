import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NewMoodPickerComponent } from './list/new-mood-picker.component';
import { NewMoodPickerDetailComponent } from './detail/new-mood-picker-detail.component';
import { NewMoodPickerUpdateComponent } from './update/new-mood-picker-update.component';
import { NewMoodPickerDeleteDialogComponent } from './delete/new-mood-picker-delete-dialog.component';
import { NewMoodPickerRoutingModule } from './route/new-mood-picker-routing.module';

@NgModule({
  imports: [SharedModule, NewMoodPickerRoutingModule],
  declarations: [NewMoodPickerComponent, NewMoodPickerDetailComponent, NewMoodPickerUpdateComponent, NewMoodPickerDeleteDialogComponent],
})
export class NewMoodPickerModule {}
