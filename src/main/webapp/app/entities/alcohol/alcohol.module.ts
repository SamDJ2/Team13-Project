import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AlcoholComponent } from './list/alcohol.component';
import { AlcoholDetailComponent } from './detail/alcohol-detail.component';
import { AlcoholUpdateComponent } from './update/alcohol-update.component';
import { AlcoholDeleteDialogComponent } from './delete/alcohol-delete-dialog.component';
import { AlcoholRoutingModule } from './route/alcohol-routing.module';

@NgModule({
  imports: [SharedModule, AlcoholRoutingModule],
  declarations: [AlcoholComponent, AlcoholDetailComponent, AlcoholUpdateComponent, AlcoholDeleteDialogComponent],
})
export class AlcoholModule {}
