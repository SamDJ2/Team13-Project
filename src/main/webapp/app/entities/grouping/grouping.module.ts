import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GroupingComponent } from './list/grouping.component';
import { GroupingDetailComponent } from './detail/grouping-detail.component';
import { GroupingUpdateComponent } from './update/grouping-update.component';
import { GroupingDeleteDialogComponent } from './delete/grouping-delete-dialog.component';
import { GroupingRoutingModule } from './route/grouping-routing.module';

@NgModule({
  imports: [SharedModule, GroupingRoutingModule],
  declarations: [GroupingComponent, GroupingDetailComponent, GroupingUpdateComponent, GroupingDeleteDialogComponent],
})
export class GroupingModule {}
