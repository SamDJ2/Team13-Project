import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INewMoodPicker, NewNewMoodPicker } from '../new-mood-picker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INewMoodPicker for edit and NewNewMoodPickerFormGroupInput for create.
 */
type NewMoodPickerFormGroupInput = INewMoodPicker | PartialWithRequiredKeyOf<NewNewMoodPicker>;

type NewMoodPickerFormDefaults = Pick<NewNewMoodPicker, 'id'>;

type NewMoodPickerFormGroupContent = {
  id: FormControl<INewMoodPicker['id'] | NewNewMoodPicker['id']>;
  username: FormControl<INewMoodPicker['username']>;
  mood: FormControl<INewMoodPicker['mood']>;
};

export type NewMoodPickerFormGroup = FormGroup<NewMoodPickerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NewMoodPickerFormService {
  createNewMoodPickerFormGroup(newMoodPicker: NewMoodPickerFormGroupInput = { id: null }): NewMoodPickerFormGroup {
    const newMoodPickerRawValue = {
      ...this.getFormDefaults(),
      ...newMoodPicker,
    };
    return new FormGroup<NewMoodPickerFormGroupContent>({
      id: new FormControl(
        { value: newMoodPickerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(newMoodPickerRawValue.username),
      mood: new FormControl(newMoodPickerRawValue.mood),
    });
  }

  getNewMoodPicker(form: NewMoodPickerFormGroup): INewMoodPicker | NewNewMoodPicker {
    return form.getRawValue() as INewMoodPicker | NewNewMoodPicker;
  }

  resetForm(form: NewMoodPickerFormGroup, newMoodPicker: NewMoodPickerFormGroupInput): void {
    const newMoodPickerRawValue = { ...this.getFormDefaults(), ...newMoodPicker };
    form.reset(
      {
        ...newMoodPickerRawValue,
        id: { value: newMoodPickerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NewMoodPickerFormDefaults {
    return {
      id: null,
    };
  }
}
