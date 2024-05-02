import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISocialMedia } from '../social-media.model';
import { SocialMediaService } from '../service/social-media.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './social-media-delete-dialog.component.html',
})
export class SocialMediaDeleteDialogComponent {
  socialMedia?: ISocialMedia;

  constructor(protected socialMediaService: SocialMediaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.socialMediaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
