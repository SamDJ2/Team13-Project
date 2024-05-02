import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { EntriesFeature } from '../entries-feature.model';
import { EntriesFeatureService } from '../service/entries-feature.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './entries-feature-delete-dialog.component.html',
})
export class EntriesFeatureDeleteDialogComponent {
  entriesFeature?: EntriesFeature;

  constructor(protected entriesFeatureService: EntriesFeatureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.entriesFeatureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
