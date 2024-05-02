import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPromptsPage } from '../prompts-page.model';
import { PromptsPageService } from '../service/prompts-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './prompts-page-delete-dialog.component.html',
})
export class PromptsPageDeleteDialogComponent {
  promptsPage?: IPromptsPage;

  constructor(protected promptsPageService: PromptsPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.promptsPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
