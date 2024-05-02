import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { UserDBComponent } from './list/user-db.component';
import { UserDBDetailComponent } from './detail/user-db-detail.component';
import { UserDBUpdateComponent } from './update/user-db-update.component';
import { UserDBDeleteDialogComponent } from './delete/user-db-delete-dialog.component';
import { UserDBRoutingModule } from './route/user-db-routing.module';

@NgModule({
  imports: [SharedModule, UserDBRoutingModule],
  declarations: [UserDBComponent, UserDBDetailComponent, UserDBUpdateComponent, UserDBDeleteDialogComponent],
})
export class UserDBModule {}
