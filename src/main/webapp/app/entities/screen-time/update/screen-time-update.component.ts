import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ScreenTimeFormService, ScreenTimeFormGroup } from './screen-time-form.service';
import { IScreenTime } from '../screen-time.model';
import { ScreenTimeService } from '../service/screen-time.service';
import { IVideoGames } from 'app/entities/video-games/video-games.model';
import { VideoGamesService } from 'app/entities/video-games/service/video-games.service';
import { IMovies } from 'app/entities/movies/movies.model';
import { MoviesService } from 'app/entities/movies/service/movies.service';
import { ISocialMedia } from 'app/entities/social-media/social-media.model';
import { SocialMediaService } from 'app/entities/social-media/service/social-media.service';
import { IMusic } from 'app/entities/music/music.model';
import { MusicService } from 'app/entities/music/service/music.service';

@Component({
  selector: 'jhi-screen-time-update',
  templateUrl: './screen-time-update.component.html',
})
export class ScreenTimeUpdateComponent implements OnInit {
  isSaving = false;
  screenTime: IScreenTime | null = null;

  videoGamesSharedCollection: IVideoGames[] = [];
  moviesSharedCollection: IMovies[] = [];
  socialMediasSharedCollection: ISocialMedia[] = [];
  musicSharedCollection: IMusic[] = [];

  editForm: ScreenTimeFormGroup = this.screenTimeFormService.createScreenTimeFormGroup();

  constructor(
    protected screenTimeService: ScreenTimeService,
    protected screenTimeFormService: ScreenTimeFormService,
    protected videoGamesService: VideoGamesService,
    protected moviesService: MoviesService,
    protected socialMediaService: SocialMediaService,
    protected musicService: MusicService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVideoGames = (o1: IVideoGames | null, o2: IVideoGames | null): boolean => this.videoGamesService.compareVideoGames(o1, o2);

  compareMovies = (o1: IMovies | null, o2: IMovies | null): boolean => this.moviesService.compareMovies(o1, o2);

  compareSocialMedia = (o1: ISocialMedia | null, o2: ISocialMedia | null): boolean => this.socialMediaService.compareSocialMedia(o1, o2);

  compareMusic = (o1: IMusic | null, o2: IMusic | null): boolean => this.musicService.compareMusic(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ screenTime }) => {
      this.screenTime = screenTime;
      if (screenTime) {
        this.updateForm(screenTime);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const screenTime = this.screenTimeFormService.getScreenTime(this.editForm);
    if (screenTime.id !== null) {
      this.subscribeToSaveResponse(this.screenTimeService.update(screenTime));
    } else {
      this.subscribeToSaveResponse(this.screenTimeService.create(screenTime));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IScreenTime>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(screenTime: IScreenTime): void {
    this.screenTime = screenTime;
    this.screenTimeFormService.resetForm(this.editForm, screenTime);

    this.videoGamesSharedCollection = this.videoGamesService.addVideoGamesToCollectionIfMissing<IVideoGames>(
      this.videoGamesSharedCollection,
      screenTime.videoGames
    );
    this.moviesSharedCollection = this.moviesService.addMoviesToCollectionIfMissing<IMovies>(
      this.moviesSharedCollection,
      screenTime.movies
    );
    this.socialMediasSharedCollection = this.socialMediaService.addSocialMediaToCollectionIfMissing<ISocialMedia>(
      this.socialMediasSharedCollection,
      screenTime.socialMedia
    );
    this.musicSharedCollection = this.musicService.addMusicToCollectionIfMissing<IMusic>(this.musicSharedCollection, screenTime.music);
  }

  protected loadRelationshipsOptions(): void {
    this.videoGamesService
      .query()
      .pipe(map((res: HttpResponse<IVideoGames[]>) => res.body ?? []))
      .pipe(
        map((videoGames: IVideoGames[]) =>
          this.videoGamesService.addVideoGamesToCollectionIfMissing<IVideoGames>(videoGames, this.screenTime?.videoGames)
        )
      )
      .subscribe((videoGames: IVideoGames[]) => (this.videoGamesSharedCollection = videoGames));

    this.moviesService
      .query()
      .pipe(map((res: HttpResponse<IMovies[]>) => res.body ?? []))
      .pipe(map((movies: IMovies[]) => this.moviesService.addMoviesToCollectionIfMissing<IMovies>(movies, this.screenTime?.movies)))
      .subscribe((movies: IMovies[]) => (this.moviesSharedCollection = movies));

    this.socialMediaService
      .query()
      .pipe(map((res: HttpResponse<ISocialMedia[]>) => res.body ?? []))
      .pipe(
        map((socialMedias: ISocialMedia[]) =>
          this.socialMediaService.addSocialMediaToCollectionIfMissing<ISocialMedia>(socialMedias, this.screenTime?.socialMedia)
        )
      )
      .subscribe((socialMedias: ISocialMedia[]) => (this.socialMediasSharedCollection = socialMedias));

    this.musicService
      .query()
      .pipe(map((res: HttpResponse<IMusic[]>) => res.body ?? []))
      .pipe(map((music: IMusic[]) => this.musicService.addMusicToCollectionIfMissing<IMusic>(music, this.screenTime?.music)))
      .subscribe((music: IMusic[]) => (this.musicSharedCollection = music));
  }
}
