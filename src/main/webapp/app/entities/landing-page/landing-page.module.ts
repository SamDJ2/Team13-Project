import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandingPageComponent } from './list/landing-page.component';
import { LandingPageDetailComponent } from './detail/landing-page-detail.component';
import { LandingPageUpdateComponent } from './update/landing-page-update.component';
import { LandingPageDeleteDialogComponent } from './delete/landing-page-delete-dialog.component';
import { LandingPageRoutingModule } from './route/landing-page-routing.module';

@NgModule({
  imports: [SharedModule, LandingPageRoutingModule],
  declarations: [LandingPageComponent, LandingPageDetailComponent, LandingPageUpdateComponent, LandingPageDeleteDialogComponent],
})
export class LandingPageModule {}
