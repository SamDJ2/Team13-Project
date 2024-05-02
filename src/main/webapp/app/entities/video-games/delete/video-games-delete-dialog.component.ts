import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVideoGames } from '../video-games.model';
import { VideoGamesService } from '../service/video-games.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './video-games-delete-dialog.component.html',
})
export class VideoGamesDeleteDialogComponent {
  videoGames?: IVideoGames;

  constructor(protected videoGamesService: VideoGamesService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.videoGamesService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
