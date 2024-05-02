import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILeaderBoards } from '../leader-boards.model';
import { LeaderBoardsService } from '../service/leader-boards.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './leader-boards-delete-dialog.component.html',
})
export class LeaderBoardsDeleteDialogComponent {
  leaderBoards?: ILeaderBoards;

  constructor(protected leaderBoardsService: LeaderBoardsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.leaderBoardsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
