import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NavigationPortalComponent } from './list/navigation-portal.component';
import { NavigationPortalDetailComponent } from './detail/navigation-portal-detail.component';
import { NavigationPortalUpdateComponent } from './update/navigation-portal-update.component';
import { NavigationPortalDeleteDialogComponent } from './delete/navigation-portal-delete-dialog.component';
import { NavigationPortalRoutingModule } from './route/navigation-portal-routing.module';

@NgModule({
  imports: [SharedModule, NavigationPortalRoutingModule],
  declarations: [
    NavigationPortalComponent,
    NavigationPortalDetailComponent,
    NavigationPortalUpdateComponent,
    NavigationPortalDeleteDialogComponent,
  ],
})
export class NavigationPortalModule {}
