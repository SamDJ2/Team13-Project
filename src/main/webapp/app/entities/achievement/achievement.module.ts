import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AchievementComponent } from './list/achievement.component';
import { AchievementDetailComponent } from './detail/achievement-detail.component';
import { AchievementUpdateComponent } from './update/achievement-update.component';
import { AchievementDeleteDialogComponent } from './delete/achievement-delete-dialog.component';
import { AchievementRoutingModule } from './route/achievement-routing.module';

@NgModule({
  imports: [SharedModule, AchievementRoutingModule],
  declarations: [AchievementComponent, AchievementDetailComponent, AchievementUpdateComponent, AchievementDeleteDialogComponent],
})
export class AchievementModule {}
