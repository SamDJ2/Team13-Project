import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SocialMediaComponent } from './list/social-media.component';
import { SocialMediaDetailComponent } from './detail/social-media-detail.component';
import { SocialMediaUpdateComponent } from './update/social-media-update.component';
import { SocialMediaDeleteDialogComponent } from './delete/social-media-delete-dialog.component';
import { SocialMediaRoutingModule } from './route/social-media-routing.module';

@NgModule({
  imports: [SharedModule, SocialMediaRoutingModule],
  declarations: [SocialMediaComponent, SocialMediaDetailComponent, SocialMediaUpdateComponent, SocialMediaDeleteDialogComponent],
})
export class SocialMediaModule {}
