import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAlcohol } from '../alcohol.model';
import { AlcoholService } from '../service/alcohol.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './alcohol-delete-dialog.component.html',
})
export class AlcoholDeleteDialogComponent {
  alcohol?: IAlcohol;

  constructor(protected alcoholService: AlcoholService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.alcoholService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
