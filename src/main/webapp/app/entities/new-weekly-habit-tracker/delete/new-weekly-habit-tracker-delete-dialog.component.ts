import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from '../service/new-weekly-habit-tracker.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './new-weekly-habit-tracker-delete-dialog.component.html',
})
export class NewWeeklyHabitTrackerDeleteDialogComponent {
  newWeeklyHabitTracker?: INewWeeklyHabitTracker;

  constructor(protected newWeeklyHabitTrackerService: NewWeeklyHabitTrackerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.newWeeklyHabitTrackerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
