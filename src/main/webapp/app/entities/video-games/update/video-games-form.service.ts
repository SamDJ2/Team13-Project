import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVideoGames, NewVideoGames } from '../video-games.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVideoGames for edit and NewVideoGamesFormGroupInput for create.
 */
type VideoGamesFormGroupInput = IVideoGames | PartialWithRequiredKeyOf<NewVideoGames>;

type VideoGamesFormDefaults = Pick<NewVideoGames, 'id'>;

type VideoGamesFormGroupContent = {
  id: FormControl<IVideoGames['id'] | NewVideoGames['id']>;
  levels: FormControl<IVideoGames['levels']>;
  progress: FormControl<IVideoGames['progress']>;
  timer: FormControl<IVideoGames['timer']>;
};

export type VideoGamesFormGroup = FormGroup<VideoGamesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VideoGamesFormService {
  createVideoGamesFormGroup(videoGames: VideoGamesFormGroupInput = { id: null }): VideoGamesFormGroup {
    const videoGamesRawValue = {
      ...this.getFormDefaults(),
      ...videoGames,
    };
    return new FormGroup<VideoGamesFormGroupContent>({
      id: new FormControl(
        { value: videoGamesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(videoGamesRawValue.levels),
      progress: new FormControl(videoGamesRawValue.progress),
      timer: new FormControl(videoGamesRawValue.timer),
    });
  }

  getVideoGames(form: VideoGamesFormGroup): IVideoGames | NewVideoGames {
    return form.getRawValue() as IVideoGames | NewVideoGames;
  }

  resetForm(form: VideoGamesFormGroup, videoGames: VideoGamesFormGroupInput): void {
    const videoGamesRawValue = { ...this.getFormDefaults(), ...videoGames };
    form.reset(
      {
        ...videoGamesRawValue,
        id: { value: videoGamesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VideoGamesFormDefaults {
    return {
      id: null,
    };
  }
}
