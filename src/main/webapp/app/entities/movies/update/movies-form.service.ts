import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMovies, NewMovies } from '../movies.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMovies for edit and NewMoviesFormGroupInput for create.
 */
type MoviesFormGroupInput = IMovies | PartialWithRequiredKeyOf<NewMovies>;

type MoviesFormDefaults = Pick<NewMovies, 'id'>;

type MoviesFormGroupContent = {
  id: FormControl<IMovies['id'] | NewMovies['id']>;
  levels: FormControl<IMovies['levels']>;
  progress: FormControl<IMovies['progress']>;
  timer: FormControl<IMovies['timer']>;
};

export type MoviesFormGroup = FormGroup<MoviesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MoviesFormService {
  createMoviesFormGroup(movies: MoviesFormGroupInput = { id: null }): MoviesFormGroup {
    const moviesRawValue = {
      ...this.getFormDefaults(),
      ...movies,
    };
    return new FormGroup<MoviesFormGroupContent>({
      id: new FormControl(
        { value: moviesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(moviesRawValue.levels),
      progress: new FormControl(moviesRawValue.progress),
      timer: new FormControl(moviesRawValue.timer),
    });
  }

  getMovies(form: MoviesFormGroup): IMovies | NewMovies {
    return form.getRawValue() as IMovies | NewMovies;
  }

  resetForm(form: MoviesFormGroup, movies: MoviesFormGroupInput): void {
    const moviesRawValue = { ...this.getFormDefaults(), ...movies };
    form.reset(
      {
        ...moviesRawValue,
        id: { value: moviesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MoviesFormDefaults {
    return {
      id: null,
    };
  }
}
