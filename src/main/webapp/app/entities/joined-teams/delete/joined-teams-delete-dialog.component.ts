import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IJoinedTeams } from '../joined-teams.model';
import { JoinedTeamsService } from '../service/joined-teams.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './joined-teams-delete-dialog.component.html',
})
export class JoinedTeamsDeleteDialogComponent {
  joinedTeams?: IJoinedTeams;

  constructor(protected joinedTeamsService: JoinedTeamsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.joinedTeamsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
