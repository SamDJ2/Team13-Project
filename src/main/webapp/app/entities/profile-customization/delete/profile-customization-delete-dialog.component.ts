import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProfileCustomization } from '../profile-customization.model';
import { ProfileCustomizationService } from '../service/profile-customization.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './profile-customization-delete-dialog.component.html',
})
export class ProfileCustomizationDeleteDialogComponent {
  profileCustomization?: IProfileCustomization;

  constructor(protected profileCustomizationService: ProfileCustomizationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.profileCustomizationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
