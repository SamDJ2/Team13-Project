import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAlcohol, NewAlcohol } from '../alcohol.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAlcohol for edit and NewAlcoholFormGroupInput for create.
 */
type AlcoholFormGroupInput = IAlcohol | PartialWithRequiredKeyOf<NewAlcohol>;

type AlcoholFormDefaults = Pick<NewAlcohol, 'id'>;

type AlcoholFormGroupContent = {
  id: FormControl<IAlcohol['id'] | NewAlcohol['id']>;
  levels: FormControl<IAlcohol['levels']>;
  progress: FormControl<IAlcohol['progress']>;
  timer: FormControl<IAlcohol['timer']>;
};

export type AlcoholFormGroup = FormGroup<AlcoholFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AlcoholFormService {
  createAlcoholFormGroup(alcohol: AlcoholFormGroupInput = { id: null }): AlcoholFormGroup {
    const alcoholRawValue = {
      ...this.getFormDefaults(),
      ...alcohol,
    };
    return new FormGroup<AlcoholFormGroupContent>({
      id: new FormControl(
        { value: alcoholRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(alcoholRawValue.levels),
      progress: new FormControl(alcoholRawValue.progress),
      timer: new FormControl(alcoholRawValue.timer),
    });
  }

  getAlcohol(form: AlcoholFormGroup): IAlcohol | NewAlcohol {
    return form.getRawValue() as IAlcohol | NewAlcohol;
  }

  resetForm(form: AlcoholFormGroup, alcohol: AlcoholFormGroupInput): void {
    const alcoholRawValue = { ...this.getFormDefaults(), ...alcohol };
    form.reset(
      {
        ...alcoholRawValue,
        id: { value: alcoholRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AlcoholFormDefaults {
    return {
      id: null,
    };
  }
}
