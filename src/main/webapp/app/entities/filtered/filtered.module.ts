import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FilteredComponent } from './list/filtered.component';
import { FilteredDetailComponent } from './detail/filtered-detail.component';
import { FilteredUpdateComponent } from './update/filtered-update.component';
import { FilteredDeleteDialogComponent } from './delete/filtered-delete-dialog.component';
import { FilteredRoutingModule } from './route/filtered-routing.module';

@NgModule({
  imports: [SharedModule, FilteredRoutingModule],
  declarations: [FilteredComponent, FilteredDetailComponent, FilteredUpdateComponent, FilteredDeleteDialogComponent],
})
export class FilteredModule {}
