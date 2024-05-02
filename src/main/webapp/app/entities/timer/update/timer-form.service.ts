import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITimer, NewTimer } from '../timer.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITimer for edit and NewTimerFormGroupInput for create.
 */
type TimerFormGroupInput = ITimer | PartialWithRequiredKeyOf<NewTimer>;

type TimerFormDefaults = Pick<NewTimer, 'id' | 'isActive'>;

type TimerFormGroupContent = {
  id: FormControl<ITimer['id'] | NewTimer['id']>;
  startTime: FormControl<ITimer['startTime']>;
  isActive: FormControl<ITimer['isActive']>;
  timings: FormControl<ITimer['timings']>;
};

export type TimerFormGroup = FormGroup<TimerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TimerFormService {
  createTimerFormGroup(timer: TimerFormGroupInput = { id: null }): TimerFormGroup {
    const timerRawValue = {
      ...this.getFormDefaults(),
      ...timer,
    };
    return new FormGroup<TimerFormGroupContent>({
      id: new FormControl(
        { value: timerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startTime: new FormControl(timerRawValue.startTime),
      isActive: new FormControl(timerRawValue.isActive),
      timings: new FormControl(timerRawValue.timings),
    });
  }

  getTimer(form: TimerFormGroup): ITimer | NewTimer {
    return form.getRawValue() as ITimer | NewTimer;
  }

  resetForm(form: TimerFormGroup, timer: TimerFormGroupInput): void {
    const timerRawValue = { ...this.getFormDefaults(), ...timer };
    form.reset(
      {
        ...timerRawValue,
        id: { value: timerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TimerFormDefaults {
    return {
      id: null,
      isActive: false,
    };
  }
}
