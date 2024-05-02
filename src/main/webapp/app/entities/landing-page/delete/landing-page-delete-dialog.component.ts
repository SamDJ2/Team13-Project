import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandingPage } from '../landing-page.model';
import { LandingPageService } from '../service/landing-page.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './landing-page-delete-dialog.component.html',
})
export class LandingPageDeleteDialogComponent {
  landingPage?: ILandingPage;

  constructor(protected landingPageService: LandingPageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.landingPageService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
