import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJunkFood } from '../junk-food.model';
import { JunkFoodService } from '../service/junk-food.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './junk-food-delete-dialog.component.html',
})
export class JunkFoodDeleteDialogComponent {
  junkFood?: IJunkFood;

  constructor(protected junkFoodService: JunkFoodService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.junkFoodService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
