import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IHabitstracking, NewHabitstracking } from '../habitstracking.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IHabitstracking for edit and NewHabitstrackingFormGroupInput for create.
 */
type HabitstrackingFormGroupInput = IHabitstracking | PartialWithRequiredKeyOf<NewHabitstracking>;

type HabitstrackingFormDefaults = Pick<NewHabitstracking, 'id' | 'completedHabit'>;

type HabitstrackingFormGroupContent = {
  id: FormControl<IHabitstracking['id'] | NewHabitstracking['id']>;
  nameOfHabit: FormControl<IHabitstracking['nameOfHabit']>;
  dayOfHabit: FormControl<IHabitstracking['dayOfHabit']>;
  weekOfHabit: FormControl<IHabitstracking['weekOfHabit']>;
  completedHabit: FormControl<IHabitstracking['completedHabit']>;
  usernameHabit: FormControl<IHabitstracking['usernameHabit']>;
  habitIDEN: FormControl<IHabitstracking['habitIDEN']>;
  summary: FormControl<IHabitstracking['summary']>;
};

export type HabitstrackingFormGroup = FormGroup<HabitstrackingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class HabitstrackingFormService {
  createHabitstrackingFormGroup(habitstracking: HabitstrackingFormGroupInput = { id: null }): HabitstrackingFormGroup {
    const habitstrackingRawValue = {
      ...this.getFormDefaults(),
      ...habitstracking,
    };
    return new FormGroup<HabitstrackingFormGroupContent>({
      id: new FormControl(
        { value: habitstrackingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nameOfHabit: new FormControl(habitstrackingRawValue.nameOfHabit),
      dayOfHabit: new FormControl(habitstrackingRawValue.dayOfHabit),
      weekOfHabit: new FormControl(habitstrackingRawValue.weekOfHabit),
      completedHabit: new FormControl(habitstrackingRawValue.completedHabit),
      usernameHabit: new FormControl(habitstrackingRawValue.usernameHabit),
      habitIDEN: new FormControl(habitstrackingRawValue.habitIDEN),
      summary: new FormControl(habitstrackingRawValue.summary),
    });
  }

  getHabitstracking(form: HabitstrackingFormGroup): IHabitstracking | NewHabitstracking {
    return form.getRawValue() as IHabitstracking | NewHabitstracking;
  }

  resetForm(form: HabitstrackingFormGroup, habitstracking: HabitstrackingFormGroupInput): void {
    const habitstrackingRawValue = { ...this.getFormDefaults(), ...habitstracking };
    form.reset(
      {
        ...habitstrackingRawValue,
        id: { value: habitstrackingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): HabitstrackingFormDefaults {
    return {
      id: null,
      completedHabit: false,
    };
  }
}
