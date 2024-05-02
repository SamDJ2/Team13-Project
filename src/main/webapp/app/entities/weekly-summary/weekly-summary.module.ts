import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WeeklySummaryComponent } from './list/weekly-summary.component';
import { WeeklySummaryDetailComponent } from './detail/weekly-summary-detail.component';
import { WeeklySummaryUpdateComponent } from './update/weekly-summary-update.component';
import { WeeklySummaryDeleteDialogComponent } from './delete/weekly-summary-delete-dialog.component';
import { WeeklySummaryRoutingModule } from './route/weekly-summary-routing.module';

@NgModule({
  imports: [SharedModule, WeeklySummaryRoutingModule],
  declarations: [WeeklySummaryComponent, WeeklySummaryDetailComponent, WeeklySummaryUpdateComponent, WeeklySummaryDeleteDialogComponent],
})
export class WeeklySummaryModule {}
