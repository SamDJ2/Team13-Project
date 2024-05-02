import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EmotionPageComponent } from './list/emotion-page.component';
import { EmotionPageDetailComponent } from './detail/emotion-page-detail.component';
import { EmotionPageUpdateComponent } from './update/emotion-page-update.component';
import { EmotionPageDeleteDialogComponent } from './delete/emotion-page-delete-dialog.component';
import { EmotionPageRoutingModule } from './route/emotion-page-routing.module';

@NgModule({
  imports: [SharedModule, EmotionPageRoutingModule],
  declarations: [EmotionPageComponent, EmotionPageDetailComponent, EmotionPageUpdateComponent, EmotionPageDeleteDialogComponent],
})
export class EmotionPageModule {}
