import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMoodJournalPage } from '../mood-journal-page.model';
import { MoodJournalPageService } from '../service/mood-journal-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './mood-journal-page-delete-dialog.component.html',
})
export class MoodJournalPageDeleteDialogComponent {
  moodJournalPage?: IMoodJournalPage;

  constructor(protected moodJournalPageService: MoodJournalPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.moodJournalPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
