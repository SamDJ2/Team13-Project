import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MusicComponent } from './list/music.component';
import { MusicDetailComponent } from './detail/music-detail.component';
import { MusicUpdateComponent } from './update/music-update.component';
import { MusicDeleteDialogComponent } from './delete/music-delete-dialog.component';
import { MusicRoutingModule } from './route/music-routing.module';

@NgModule({
  imports: [SharedModule, MusicRoutingModule],
  declarations: [MusicComponent, MusicDetailComponent, MusicUpdateComponent, MusicDeleteDialogComponent],
})
export class MusicModule {}
