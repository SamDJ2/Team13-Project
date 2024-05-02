import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChallengesComponent } from './list/challenges.component';
import { ChallengesDetailComponent } from './detail/challenges-detail.component';
import { ChallengesUpdateComponent } from './update/challenges-update.component';
import { ChallengesDeleteDialogComponent } from './delete/challenges-delete-dialog.component';
import { ChallengesRoutingModule } from './route/challenges-routing.module';

@NgModule({
  imports: [SharedModule, ChallengesRoutingModule],
  declarations: [ChallengesComponent, ChallengesDetailComponent, ChallengesUpdateComponent, ChallengesDeleteDialogComponent],
})
export class ChallengesModule {}
