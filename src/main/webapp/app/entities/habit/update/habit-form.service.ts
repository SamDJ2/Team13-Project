import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHabit, NewHabit } from '../habit.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHabit for edit and NewHabitFormGroupInput for create.
 */
type HabitFormGroupInput = IHabit | PartialWithRequiredKeyOf<NewHabit>;

type HabitFormDefaults = Pick<NewHabit, 'id'>;

type HabitFormGroupContent = {
  id: FormControl<IHabit['id'] | NewHabit['id']>;
  habitID: FormControl<IHabit['habitID']>;
  habitName: FormControl<IHabit['habitName']>;
};

export type HabitFormGroup = FormGroup<HabitFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitFormService {
  createHabitFormGroup(habit: HabitFormGroupInput = { id: null }): HabitFormGroup {
    const habitRawValue = {
      ...this.getFormDefaults(),
      ...habit,
    };
    return new FormGroup<HabitFormGroupContent>({
      id: new FormControl(
        { value: habitRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      habitID: new FormControl(habitRawValue.habitID),
      habitName: new FormControl(habitRawValue.habitName),
    });
  }

  getHabit(form: HabitFormGroup): IHabit | NewHabit {
    return form.getRawValue() as IHabit | NewHabit;
  }

  resetForm(form: HabitFormGroup, habit: HabitFormGroupInput): void {
    const habitRawValue = { ...this.getFormDefaults(), ...habit };
    form.reset(
      {
        ...habitRawValue,
        id: { value: habitRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HabitFormDefaults {
    return {
      id: null,
    };
  }
}
