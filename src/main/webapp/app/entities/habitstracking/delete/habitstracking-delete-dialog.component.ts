import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHabitstracking } from '../habitstracking.model';
import { HabitstrackingService } from '../service/habitstracking.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './habitstracking-delete-dialog.component.html',
})
export class HabitstrackingDeleteDialogComponent {
  habitstracking?: IHabitstracking;

  constructor(protected habitstrackingService: HabitstrackingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.habitstrackingService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
