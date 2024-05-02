import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LeaderBoardsComponent } from './list/leader-boards.component';
import { LeaderBoardsDetailComponent } from './detail/leader-boards-detail.component';
import { LeaderBoardsUpdateComponent } from './update/leader-boards-update.component';
import { LeaderBoardsDeleteDialogComponent } from './delete/leader-boards-delete-dialog.component';
import { LeaderBoardsRoutingModule } from './route/leader-boards-routing.module';

@NgModule({
  imports: [SharedModule, LeaderBoardsRoutingModule],
  declarations: [LeaderBoardsComponent, LeaderBoardsDetailComponent, LeaderBoardsUpdateComponent, LeaderBoardsDeleteDialogComponent],
})
export class LeaderBoardsModule {}
