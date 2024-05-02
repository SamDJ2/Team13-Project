import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAchievement } from '../achievement.model';
import { AchievementService } from '../service/achievement.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './achievement-delete-dialog.component.html',
})
export class AchievementDeleteDialogComponent {
  achievement?: IAchievement;

  constructor(protected achievementService: AchievementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.achievementService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
