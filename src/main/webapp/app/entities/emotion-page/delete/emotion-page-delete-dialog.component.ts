import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmotionPage } from '../emotion-page.model';
import { EmotionPageService } from '../service/emotion-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './emotion-page-delete-dialog.component.html',
})
export class EmotionPageDeleteDialogComponent {
  emotionPage?: IEmotionPage;

  constructor(protected emotionPageService: EmotionPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.emotionPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
