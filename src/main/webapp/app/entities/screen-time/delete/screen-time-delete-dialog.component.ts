import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IScreenTime } from '../screen-time.model';
import { ScreenTimeService } from '../service/screen-time.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './screen-time-delete-dialog.component.html',
})
export class ScreenTimeDeleteDialogComponent {
  screenTime?: IScreenTime;

  constructor(protected screenTimeService: ScreenTimeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.screenTimeService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
