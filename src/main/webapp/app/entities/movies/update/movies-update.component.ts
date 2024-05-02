import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { MoviesFormService, MoviesFormGroup } from './movies-form.service';
import { IMovies } from '../movies.model';
import { MoviesService } from '../service/movies.service';

@Component({
  selector: 'jhi-movies-update',
  templateUrl: './movies-update.component.html',
})
export class MoviesUpdateComponent implements OnInit {
  isSaving = false;
  movies: IMovies | null = null;

  editForm: MoviesFormGroup = this.moviesFormService.createMoviesFormGroup();

  constructor(
    protected moviesService: MoviesService,
    protected moviesFormService: MoviesFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ movies }) => {
      this.movies = movies;
      if (movies) {
        this.updateForm(movies);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const movies = this.moviesFormService.getMovies(this.editForm);
    if (movies.id !== null) {
      this.subscribeToSaveResponse(this.moviesService.update(movies));
    } else {
      this.subscribeToSaveResponse(this.moviesService.create(movies));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMovies>>): void {
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

  protected updateForm(movies: IMovies): void {
    this.movies = movies;
    this.moviesFormService.resetForm(this.editForm, movies);
  }
}
