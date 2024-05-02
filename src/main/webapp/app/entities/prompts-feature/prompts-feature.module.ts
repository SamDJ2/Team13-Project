import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PromptsFeatureComponent } from './list/prompts-feature.component';
import { PromptsFeatureDetailComponent } from './detail/prompts-feature-detail.component';
import { PromptsFeatureUpdateComponent } from './update/prompts-feature-update.component';
import { PromptsFeatureDeleteDialogComponent } from './delete/prompts-feature-delete-dialog.component';
import { PromptsFeatureRoutingModule } from './route/prompts-feature-routing.module';

@NgModule({
  imports: [SharedModule, PromptsFeatureRoutingModule],
  declarations: [
    PromptsFeatureComponent,
    PromptsFeatureDetailComponent,
    PromptsFeatureUpdateComponent,
    PromptsFeatureDeleteDialogComponent,
  ],
})
export class PromptsFeatureModule {}
