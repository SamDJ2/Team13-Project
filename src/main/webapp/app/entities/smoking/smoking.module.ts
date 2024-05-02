import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SmokingComponent } from './list/smoking.component';
import { SmokingDetailComponent } from './detail/smoking-detail.component';
import { SmokingUpdateComponent } from './update/smoking-update.component';
import { SmokingDeleteDialogComponent } from './delete/smoking-delete-dialog.component';
import { SmokingRoutingModule } from './route/smoking-routing.module';

@NgModule({
  imports: [SharedModule, SmokingRoutingModule],
  declarations: [SmokingComponent, SmokingDetailComponent, SmokingUpdateComponent, SmokingDeleteDialogComponent],
})
export class SmokingModule {}
