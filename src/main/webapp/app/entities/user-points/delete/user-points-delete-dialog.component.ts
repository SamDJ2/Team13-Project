import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserPoints } from '../user-points.model';
import { UserPointsService } from '../service/user-points.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './user-points-delete-dialog.component.html',
})
export class UserPointsDeleteDialogComponent {
  userPoints?: IUserPoints;

  constructor(protected userPointsService: UserPointsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userPointsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
