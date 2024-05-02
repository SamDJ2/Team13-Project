import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VideoGamesFormService, VideoGamesFormGroup } from './video-games-form.service';
import { IVideoGames } from '../video-games.model';
import { VideoGamesService } from '../service/video-games.service';

@Component({
  selector: 'jhi-video-games-update',
  templateUrl: './video-games-update.component.html',
})
export class VideoGamesUpdateComponent implements OnInit {
  isSaving = false;
  videoGames: IVideoGames | null = null;

  editForm: VideoGamesFormGroup = this.videoGamesFormService.createVideoGamesFormGroup();

  constructor(
    protected videoGamesService: VideoGamesService,
    protected videoGamesFormService: VideoGamesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ videoGames }) => {
      this.videoGames = videoGames;
      if (videoGames) {
        this.updateForm(videoGames);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const videoGames = this.videoGamesFormService.getVideoGames(this.editForm);
    if (videoGames.id !== null) {
      this.subscribeToSaveResponse(this.videoGamesService.update(videoGames));
    } else {
      this.subscribeToSaveResponse(this.videoGamesService.create(videoGames));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVideoGames>>): void {
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

  protected updateForm(videoGames: IVideoGames): void {
    this.videoGames = videoGames;
    this.videoGamesFormService.resetForm(this.editForm, videoGames);
  }
}
