import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EntriesFeatureComponent } from './list/entries-feature.component';
import { EntriesFeatureDetailComponent } from './detail/entries-feature-detail.component';
import { EntriesFeatureUpdateComponent } from './update/entries-feature-update.component';
import { EntriesFeatureDeleteDialogComponent } from './delete/entries-feature-delete-dialog.component';
import { EntriesFeatureRoutingModule } from './route/entries-feature-routing.module';

@NgModule({
  imports: [SharedModule, EntriesFeatureRoutingModule],
  declarations: [
    EntriesFeatureComponent,
    EntriesFeatureDetailComponent,
    EntriesFeatureUpdateComponent,
    EntriesFeatureDeleteDialogComponent,
  ],
})
export class EntriesFeatureModule {}
