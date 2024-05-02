import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EntriesPageComponent } from './list/entries-page.component';
import { EntriesPageDetailComponent } from './detail/entries-page-detail.component';
import { EntriesPageUpdateComponent } from './update/entries-page-update.component';
import { EntriesPageDeleteDialogComponent } from './delete/entries-page-delete-dialog.component';
import { EntriesPageRoutingModule } from './route/entries-page-routing.module';

@NgModule({
  imports: [SharedModule, EntriesPageRoutingModule],
  declarations: [EntriesPageComponent, EntriesPageDetailComponent, EntriesPageUpdateComponent, EntriesPageDeleteDialogComponent],
})
export class EntriesPageModule {}
