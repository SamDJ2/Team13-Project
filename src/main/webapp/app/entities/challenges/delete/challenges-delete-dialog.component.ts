import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IChallenges } from '../challenges.model';
import { ChallengesService } from '../service/challenges.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './challenges-delete-dialog.component.html',
})
export class ChallengesDeleteDialogComponent {
  challenges?: IChallenges;

  constructor(protected challengesService: ChallengesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.challengesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
