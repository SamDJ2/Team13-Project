import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IWeeklySummary } from '../weekly-summary.model';
import { WeeklySummaryService } from '../service/weekly-summary.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './weekly-summary-delete-dialog.component.html',
})
export class WeeklySummaryDeleteDialogComponent {
  weeklySummary?: IWeeklySummary;

  constructor(protected weeklySummaryService: WeeklySummaryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.weeklySummaryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
