import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IFiltered } from '../filtered.model';
import { FilteredService } from '../service/filtered.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './filtered-delete-dialog.component.html',
})
export class FilteredDeleteDialogComponent {
  filtered?: IFiltered;

  constructor(protected filteredService: FilteredService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.filteredService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
