import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MusicFormService, MusicFormGroup } from './music-form.service';
import { IMusic } from '../music.model';
import { MusicService } from '../service/music.service';

@Component({
  selector: 'jhi-music-update',
  templateUrl: './music-update.component.html',
})
export class MusicUpdateComponent implements OnInit {
  isSaving = false;
  music: IMusic | null = null;

  editForm: MusicFormGroup = this.musicFormService.createMusicFormGroup();

  constructor(
    protected musicService: MusicService,
    protected musicFormService: MusicFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ music }) => {
      this.music = music;
      if (music) {
        this.updateForm(music);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const music = this.musicFormService.getMusic(this.editForm);
    if (music.id !== null) {
      this.subscribeToSaveResponse(this.musicService.update(music));
    } else {
      this.subscribeToSaveResponse(this.musicService.create(music));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMusic>>): void {
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

  protected updateForm(music: IMusic): void {
    this.music = music;
    this.musicFormService.resetForm(this.editForm, music);
  }
}
