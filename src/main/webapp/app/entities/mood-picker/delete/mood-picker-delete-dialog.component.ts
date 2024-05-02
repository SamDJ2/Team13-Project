import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoodPicker } from '../mood-picker.model';
import { MoodPickerService } from '../service/mood-picker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mood-picker-delete-dialog.component.html',
})
export class MoodPickerDeleteDialogComponent {
  moodPicker?: IMoodPicker;

  constructor(protected moodPickerService: MoodPickerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moodPickerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
