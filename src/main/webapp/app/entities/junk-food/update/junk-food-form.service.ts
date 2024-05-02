import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJunkFood, NewJunkFood } from '../junk-food.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJunkFood for edit and NewJunkFoodFormGroupInput for create.
 */
type JunkFoodFormGroupInput = IJunkFood | PartialWithRequiredKeyOf<NewJunkFood>;

type JunkFoodFormDefaults = Pick<NewJunkFood, 'id'>;

type JunkFoodFormGroupContent = {
  id: FormControl<IJunkFood['id'] | NewJunkFood['id']>;
  levels: FormControl<IJunkFood['levels']>;
  progress: FormControl<IJunkFood['progress']>;
  timer: FormControl<IJunkFood['timer']>;
};

export type JunkFoodFormGroup = FormGroup<JunkFoodFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JunkFoodFormService {
  createJunkFoodFormGroup(junkFood: JunkFoodFormGroupInput = { id: null }): JunkFoodFormGroup {
    const junkFoodRawValue = {
      ...this.getFormDefaults(),
      ...junkFood,
    };
    return new FormGroup<JunkFoodFormGroupContent>({
      id: new FormControl(
        { value: junkFoodRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(junkFoodRawValue.levels),
      progress: new FormControl(junkFoodRawValue.progress),
      timer: new FormControl(junkFoodRawValue.timer),
    });
  }

  getJunkFood(form: JunkFoodFormGroup): IJunkFood | NewJunkFood {
    return form.getRawValue() as IJunkFood | NewJunkFood;
  }

  resetForm(form: JunkFoodFormGroup, junkFood: JunkFoodFormGroupInput): void {
    const junkFoodRawValue = { ...this.getFormDefaults(), ...junkFood };
    form.reset(
      {
        ...junkFoodRawValue,
        id: { value: junkFoodRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JunkFoodFormDefaults {
    return {
      id: null,
    };
  }
}
