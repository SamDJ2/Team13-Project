import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INewMoodPicker } from '../new-mood-picker.model';
import { NewMoodPickerService } from '../service/new-mood-picker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './new-mood-picker-delete-dialog.component.html',
})
export class NewMoodPickerDeleteDialogComponent {
  newMoodPicker?: INewMoodPicker;

  constructor(protected newMoodPickerService: NewMoodPickerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.newMoodPickerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
