import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMusic, NewMusic } from '../music.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMusic for edit and NewMusicFormGroupInput for create.
 */
type MusicFormGroupInput = IMusic | PartialWithRequiredKeyOf<NewMusic>;

type MusicFormDefaults = Pick<NewMusic, 'id'>;

type MusicFormGroupContent = {
  id: FormControl<IMusic['id'] | NewMusic['id']>;
  levels: FormControl<IMusic['levels']>;
  progress: FormControl<IMusic['progress']>;
  timer: FormControl<IMusic['timer']>;
};

export type MusicFormGroup = FormGroup<MusicFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MusicFormService {
  createMusicFormGroup(music: MusicFormGroupInput = { id: null }): MusicFormGroup {
    const musicRawValue = {
      ...this.getFormDefaults(),
      ...music,
    };
    return new FormGroup<MusicFormGroupContent>({
      id: new FormControl(
        { value: musicRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(musicRawValue.levels),
      progress: new FormControl(musicRawValue.progress),
      timer: new FormControl(musicRawValue.timer),
    });
  }

  getMusic(form: MusicFormGroup): IMusic | NewMusic {
    return form.getRawValue() as IMusic | NewMusic;
  }

  resetForm(form: MusicFormGroup, music: MusicFormGroupInput): void {
    const musicRawValue = { ...this.getFormDefaults(), ...music };
    form.reset(
      {
        ...musicRawValue,
        id: { value: musicRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MusicFormDefaults {
    return {
      id: null,
    };
  }
}
