import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VideoGamesComponent } from './list/video-games.component';
import { VideoGamesDetailComponent } from './detail/video-games-detail.component';
import { VideoGamesUpdateComponent } from './update/video-games-update.component';
import { VideoGamesDeleteDialogComponent } from './delete/video-games-delete-dialog.component';
import { VideoGamesRoutingModule } from './route/video-games-routing.module';

@NgModule({
  imports: [SharedModule, VideoGamesRoutingModule],
  declarations: [VideoGamesComponent, VideoGamesDetailComponent, VideoGamesUpdateComponent, VideoGamesDeleteDialogComponent],
})
export class VideoGamesModule {}
