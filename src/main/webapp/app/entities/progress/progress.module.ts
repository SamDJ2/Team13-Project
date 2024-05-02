import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProgressComponent } from './list/progress.component';
import { ProgressDetailComponent } from './detail/progress-detail.component';
import { ProgressUpdateComponent } from './update/progress-update.component';
import { ProgressDeleteDialogComponent } from './delete/progress-delete-dialog.component';
import { ProgressRoutingModule } from './route/progress-routing.module';

@NgModule({
  imports: [SharedModule, ProgressRoutingModule],
  declarations: [ProgressComponent, ProgressDetailComponent, ProgressUpdateComponent, ProgressDeleteDialogComponent],
})
export class ProgressModule {}
