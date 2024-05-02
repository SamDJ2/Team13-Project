import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserPointsComponent } from './list/user-points.component';
import { UserPointsDetailComponent } from './detail/user-points-detail.component';
import { UserPointsUpdateComponent } from './update/user-points-update.component';
import { UserPointsDeleteDialogComponent } from './delete/user-points-delete-dialog.component';
import { UserPointsRoutingModule } from './route/user-points-routing.module';

@NgModule({
  imports: [SharedModule, UserPointsRoutingModule],
  declarations: [UserPointsComponent, UserPointsDetailComponent, UserPointsUpdateComponent, UserPointsDeleteDialogComponent],
})
export class UserPointsModule {}
