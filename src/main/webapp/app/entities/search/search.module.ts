import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SearchComponent } from './list/search.component';
import { SearchDetailComponent } from './detail/search-detail.component';
import { SearchUpdateComponent } from './update/search-update.component';
import { SearchDeleteDialogComponent } from './delete/search-delete-dialog.component';
import { SearchRoutingModule } from './route/search-routing.module';

@NgModule({
  imports: [SharedModule, SearchRoutingModule],
  declarations: [SearchComponent, SearchDetailComponent, SearchUpdateComponent, SearchDeleteDialogComponent],
})
export class SearchModule {}
