import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MembersComponent } from './list/members.component';
import { MembersDetailComponent } from './detail/members-detail.component';
import { MembersUpdateComponent } from './update/members-update.component';
import { MembersDeleteDialogComponent } from './delete/members-delete-dialog.component';
import { MembersRoutingModule } from './route/members-routing.module';

@NgModule({
  imports: [SharedModule, MembersRoutingModule],
  declarations: [MembersComponent, MembersDetailComponent, MembersUpdateComponent, MembersDeleteDialogComponent],
})
export class MembersModule {}
