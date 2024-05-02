import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MoviesComponent } from './list/movies.component';
import { MoviesDetailComponent } from './detail/movies-detail.component';
import { MoviesUpdateComponent } from './update/movies-update.component';
import { MoviesDeleteDialogComponent } from './delete/movies-delete-dialog.component';
import { MoviesRoutingModule } from './route/movies-routing.module';

@NgModule({
  imports: [SharedModule, MoviesRoutingModule],
  declarations: [MoviesComponent, MoviesDetailComponent, MoviesUpdateComponent, MoviesDeleteDialogComponent],
})
export class MoviesModule {}
