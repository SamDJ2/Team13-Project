import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProfileCustomizationComponent } from './list/profile-customization.component';
import { ProfileCustomizationDetailComponent } from './detail/profile-customization-detail.component';
import { ProfileCustomizationUpdateComponent } from './update/profile-customization-update.component';
import { ProfileCustomizationDeleteDialogComponent } from './delete/profile-customization-delete-dialog.component';
import { ProfileCustomizationRoutingModule } from './route/profile-customization-routing.module';

@NgModule({
  imports: [SharedModule, ProfileCustomizationRoutingModule],
  declarations: [
    ProfileCustomizationComponent,
    ProfileCustomizationDetailComponent,
    ProfileCustomizationUpdateComponent,
    ProfileCustomizationDeleteDialogComponent,
  ],
})
export class ProfileCustomizationModule {}
