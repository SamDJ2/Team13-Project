import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMoodPicker, NewMoodPicker } from '../mood-picker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMoodPicker for edit and NewMoodPickerFormGroupInput for create.
 */
type MoodPickerFormGroupInput = IMoodPicker | PartialWithRequiredKeyOf<NewMoodPicker>;

type MoodPickerFormDefaults = Pick<NewMoodPicker, 'id'>;

type MoodPickerFormGroupContent = {
  id: FormControl<IMoodPicker['id'] | NewMoodPicker['id']>;
  moodPickerID: FormControl<IMoodPicker['moodPickerID']>;
  mood: FormControl<IMoodPicker['mood']>;
  navigationPortal: FormControl<IMoodPicker['navigationPortal']>;
};

export type MoodPickerFormGroup = FormGroup<MoodPickerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MoodPickerFormService {
  createMoodPickerFormGroup(moodPicker: MoodPickerFormGroupInput = { id: null }): MoodPickerFormGroup {
    const moodPickerRawValue = {
      ...this.getFormDefaults(),
      ...moodPicker,
    };
    return new FormGroup<MoodPickerFormGroupContent>({
      id: new FormControl(
        { value: moodPickerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      moodPickerID: new FormControl(moodPickerRawValue.moodPickerID),
      mood: new FormControl(moodPickerRawValue.mood),
      navigationPortal: new FormControl(moodPickerRawValue.navigationPortal),
    });
  }

  getMoodPicker(form: MoodPickerFormGroup): IMoodPicker | NewMoodPicker {
    return form.getRawValue() as IMoodPicker | NewMoodPicker;
  }

  resetForm(form: MoodPickerFormGroup, moodPicker: MoodPickerFormGroupInput): void {
    const moodPickerRawValue = { ...this.getFormDefaults(), ...moodPicker };
    form.reset(
      {
        ...moodPickerRawValue,
        id: { value: moodPickerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MoodPickerFormDefaults {
    return {
      id: null,
    };
  }
}
