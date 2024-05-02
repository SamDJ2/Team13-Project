import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { PromptsFeature } from '../prompts-feature.model';
import { PromptsFeatureService } from '../service/prompts-feature.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './prompts-feature-delete-dialog.component.html',
})
export class PromptsFeatureDeleteDialogComponent {
  promptsFeature?: PromptsFeature;

  constructor(protected promptsFeatureService: PromptsFeatureService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.promptsFeatureService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
