import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INewWeeklyHabitTracker, NewNewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INewWeeklyHabitTracker for edit and NewNewWeeklyHabitTrackerFormGroupInput for create.
 */
type NewWeeklyHabitTrackerFormGroupInput = INewWeeklyHabitTracker | PartialWithRequiredKeyOf<NewNewWeeklyHabitTracker>;

type NewWeeklyHabitTrackerFormDefaults = Pick<NewNewWeeklyHabitTracker, 'id' | 'habitCompletion'>;

type NewWeeklyHabitTrackerFormGroupContent = {
  id: FormControl<INewWeeklyHabitTracker['id'] | NewNewWeeklyHabitTracker['id']>;
  recordID: FormControl<INewWeeklyHabitTracker['recordID']>;
  habitCompletion: FormControl<INewWeeklyHabitTracker['habitCompletion']>;
  date: FormControl<INewWeeklyHabitTracker['date']>;
  weeklySummary: FormControl<INewWeeklyHabitTracker['weeklySummary']>;
  habit: FormControl<INewWeeklyHabitTracker['habit']>;
};

export type NewWeeklyHabitTrackerFormGroup = FormGroup<NewWeeklyHabitTrackerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NewWeeklyHabitTrackerFormService {
  createNewWeeklyHabitTrackerFormGroup(
    newWeeklyHabitTracker: NewWeeklyHabitTrackerFormGroupInput = { id: null }
  ): NewWeeklyHabitTrackerFormGroup {
    const newWeeklyHabitTrackerRawValue = {
      ...this.getFormDefaults(),
      ...newWeeklyHabitTracker,
    };
    return new FormGroup<NewWeeklyHabitTrackerFormGroupContent>({
      id: new FormControl(
        { value: newWeeklyHabitTrackerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      recordID: new FormControl(newWeeklyHabitTrackerRawValue.recordID),
      habitCompletion: new FormControl(newWeeklyHabitTrackerRawValue.habitCompletion),
      date: new FormControl(newWeeklyHabitTrackerRawValue.date),
      weeklySummary: new FormControl(newWeeklyHabitTrackerRawValue.weeklySummary),
      habit: new FormControl(newWeeklyHabitTrackerRawValue.habit),
    });
  }

  getNewWeeklyHabitTracker(form: NewWeeklyHabitTrackerFormGroup): INewWeeklyHabitTracker | NewNewWeeklyHabitTracker {
    return form.getRawValue() as INewWeeklyHabitTracker | NewNewWeeklyHabitTracker;
  }

  resetForm(form: NewWeeklyHabitTrackerFormGroup, newWeeklyHabitTracker: NewWeeklyHabitTrackerFormGroupInput): void {
    const newWeeklyHabitTrackerRawValue = { ...this.getFormDefaults(), ...newWeeklyHabitTracker };
    form.reset(
      {
        ...newWeeklyHabitTrackerRawValue,
        id: { value: newWeeklyHabitTrackerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NewWeeklyHabitTrackerFormDefaults {
    return {
      id: null,
      habitCompletion: false,
    };
  }
}
