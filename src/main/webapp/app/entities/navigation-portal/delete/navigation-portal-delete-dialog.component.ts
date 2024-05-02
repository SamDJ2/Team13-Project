import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INavigationPortal } from '../navigation-portal.model';
import { NavigationPortalService } from '../service/navigation-portal.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './navigation-portal-delete-dialog.component.html',
})
export class NavigationPortalDeleteDialogComponent {
  navigationPortal?: INavigationPortal;

  constructor(protected navigationPortalService: NavigationPortalService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.navigationPortalService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
