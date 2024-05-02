import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JoinedTeamsComponent } from './list/joined-teams.component';
import { JoinedTeamsDetailComponent } from './detail/joined-teams-detail.component';
import { JoinedTeamsUpdateComponent } from './update/joined-teams-update.component';
import { JoinedTeamsDeleteDialogComponent } from './delete/joined-teams-delete-dialog.component';
import { JoinedTeamsRoutingModule } from './route/joined-teams-routing.module';

@NgModule({
  imports: [SharedModule, JoinedTeamsRoutingModule],
  declarations: [JoinedTeamsComponent, JoinedTeamsDetailComponent, JoinedTeamsUpdateComponent, JoinedTeamsDeleteDialogComponent],
})
export class JoinedTeamsModule {}
