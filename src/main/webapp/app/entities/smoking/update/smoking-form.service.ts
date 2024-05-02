import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISmoking, NewSmoking } from '../smoking.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISmoking for edit and NewSmokingFormGroupInput for create.
 */
type SmokingFormGroupInput = ISmoking | PartialWithRequiredKeyOf<NewSmoking>;

type SmokingFormDefaults = Pick<NewSmoking, 'id'>;

type SmokingFormGroupContent = {
  id: FormControl<ISmoking['id'] | NewSmoking['id']>;
  levels: FormControl<ISmoking['levels']>;
  progress: FormControl<ISmoking['progress']>;
  timer: FormControl<ISmoking['timer']>;
};

export type SmokingFormGroup = FormGroup<SmokingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SmokingFormService {
  createSmokingFormGroup(smoking: SmokingFormGroupInput = { id: null }): SmokingFormGroup {
    const smokingRawValue = {
      ...this.getFormDefaults(),
      ...smoking,
    };
    return new FormGroup<SmokingFormGroupContent>({
      id: new FormControl(
        { value: smokingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(smokingRawValue.levels),
      progress: new FormControl(smokingRawValue.progress),
      timer: new FormControl(smokingRawValue.timer),
    });
  }

  getSmoking(form: SmokingFormGroup): ISmoking | NewSmoking {
    return form.getRawValue() as ISmoking | NewSmoking;
  }

  resetForm(form: SmokingFormGroup, smoking: SmokingFormGroupInput): void {
    const smokingRawValue = { ...this.getFormDefaults(), ...smoking };
    form.reset(
      {
        ...smokingRawValue,
        id: { value: smokingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SmokingFormDefaults {
    return {
      id: null,
    };
  }
}
