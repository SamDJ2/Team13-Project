import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HistoryComponent } from './list/history.component';
import { HistoryDetailComponent } from './detail/history-detail.component';
import { HistoryUpdateComponent } from './update/history-update.component';
import { HistoryDeleteDialogComponent } from './delete/history-delete-dialog.component';
import { HistoryRoutingModule } from './route/history-routing.module';

@NgModule({
  imports: [SharedModule, HistoryRoutingModule],
  declarations: [HistoryComponent, HistoryDetailComponent, HistoryUpdateComponent, HistoryDeleteDialogComponent],
})
export class HistoryModule {}
