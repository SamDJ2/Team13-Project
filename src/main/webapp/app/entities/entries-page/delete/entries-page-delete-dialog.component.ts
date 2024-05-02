import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEntriesPage } from '../entries-page.model';
import { EntriesPageService } from '../service/entries-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './entries-page-delete-dialog.component.html',
})
export class EntriesPageDeleteDialogComponent {
  entriesPage?: IEntriesPage;

  constructor(protected entriesPageService: EntriesPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entriesPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
