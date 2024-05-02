import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { JunkFoodComponent } from './list/junk-food.component';
import { JunkFoodDetailComponent } from './detail/junk-food-detail.component';
import { JunkFoodUpdateComponent } from './update/junk-food-update.component';
import { JunkFoodDeleteDialogComponent } from './delete/junk-food-delete-dialog.component';
import { JunkFoodRoutingModule } from './route/junk-food-routing.module';

@NgModule({
  imports: [SharedModule, JunkFoodRoutingModule],
  declarations: [JunkFoodComponent, JunkFoodDetailComponent, JunkFoodUpdateComponent, JunkFoodDeleteDialogComponent],
})
export class JunkFoodModule {}
