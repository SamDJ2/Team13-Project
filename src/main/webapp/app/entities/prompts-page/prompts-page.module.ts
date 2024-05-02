import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PromptsPageComponent } from './list/prompts-page.component';
import { PromptsPageDetailComponent } from './detail/prompts-page-detail.component';
import { PromptsPageUpdateComponent } from './update/prompts-page-update.component';
import { PromptsPageDeleteDialogComponent } from './delete/prompts-page-delete-dialog.component';
import { PromptsPageRoutingModule } from './route/prompts-page-routing.module';

@NgModule({
  imports: [SharedModule, PromptsPageRoutingModule],
  declarations: [PromptsPageComponent, PromptsPageDetailComponent, PromptsPageUpdateComponent, PromptsPageDeleteDialogComponent],
})
export class PromptsPageModule {}
