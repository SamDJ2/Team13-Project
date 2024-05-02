import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { BadgesComponent } from './list/badges.component';
import { BadgesDetailComponent } from './detail/badges-detail.component';
import { BadgesUpdateComponent } from './update/badges-update.component';
import { BadgesDeleteDialogComponent } from './delete/badges-delete-dialog.component';
import { BadgesRoutingModule } from './route/badges-routing.module';

@NgModule({
  imports: [SharedModule, BadgesRoutingModule],
  declarations: [BadgesComponent, BadgesDetailComponent, BadgesUpdateComponent, BadgesDeleteDialogComponent],
})
export class BadgesModule {}
