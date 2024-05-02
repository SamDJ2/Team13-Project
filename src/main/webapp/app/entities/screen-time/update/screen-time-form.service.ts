import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IScreenTime, NewScreenTime } from '../screen-time.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IScreenTime for edit and NewScreenTimeFormGroupInput for create.
 */
type ScreenTimeFormGroupInput = IScreenTime | PartialWithRequiredKeyOf<NewScreenTime>;

type ScreenTimeFormDefaults = Pick<NewScreenTime, 'id' | 'selectCategory'>;

type ScreenTimeFormGroupContent = {
  id: FormControl<IScreenTime['id'] | NewScreenTime['id']>;
  selectCategory: FormControl<IScreenTime['selectCategory']>;
  videoGames: FormControl<IScreenTime['videoGames']>;
  movies: FormControl<IScreenTime['movies']>;
  socialMedia: FormControl<IScreenTime['socialMedia']>;
  music: FormControl<IScreenTime['music']>;
};

export type ScreenTimeFormGroup = FormGroup<ScreenTimeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ScreenTimeFormService {
  createScreenTimeFormGroup(screenTime: ScreenTimeFormGroupInput = { id: null }): ScreenTimeFormGroup {
    const screenTimeRawValue = {
      ...this.getFormDefaults(),
      ...screenTime,
    };
    return new FormGroup<ScreenTimeFormGroupContent>({
      id: new FormControl(
        { value: screenTimeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      selectCategory: new FormControl(screenTimeRawValue.selectCategory),
      videoGames: new FormControl(screenTimeRawValue.videoGames),
      movies: new FormControl(screenTimeRawValue.movies),
      socialMedia: new FormControl(screenTimeRawValue.socialMedia),
      music: new FormControl(screenTimeRawValue.music),
    });
  }

  getScreenTime(form: ScreenTimeFormGroup): IScreenTime | NewScreenTime {
    return form.getRawValue() as IScreenTime | NewScreenTime;
  }

  resetForm(form: ScreenTimeFormGroup, screenTime: ScreenTimeFormGroupInput): void {
    const screenTimeRawValue = { ...this.getFormDefaults(), ...screenTime };
    form.reset(
      {
        ...screenTimeRawValue,
        id: { value: screenTimeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ScreenTimeFormDefaults {
    return {
      id: null,
      selectCategory: false,
    };
  }
}
