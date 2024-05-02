import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWeeklySummary, NewWeeklySummary } from '../weekly-summary.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWeeklySummary for edit and NewWeeklySummaryFormGroupInput for create.
 */
type WeeklySummaryFormGroupInput = IWeeklySummary | PartialWithRequiredKeyOf<NewWeeklySummary>;

type WeeklySummaryFormDefaults = Pick<NewWeeklySummary, 'id'>;

type WeeklySummaryFormGroupContent = {
  id: FormControl<IWeeklySummary['id'] | NewWeeklySummary['id']>;
  summaryID: FormControl<IWeeklySummary['summaryID']>;
  summaryText: FormControl<IWeeklySummary['summaryText']>;
};

export type WeeklySummaryFormGroup = FormGroup<WeeklySummaryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WeeklySummaryFormService {
  createWeeklySummaryFormGroup(weeklySummary: WeeklySummaryFormGroupInput = { id: null }): WeeklySummaryFormGroup {
    const weeklySummaryRawValue = {
      ...this.getFormDefaults(),
      ...weeklySummary,
    };
    return new FormGroup<WeeklySummaryFormGroupContent>({
      id: new FormControl(
        { value: weeklySummaryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      summaryID: new FormControl(weeklySummaryRawValue.summaryID),
      summaryText: new FormControl(weeklySummaryRawValue.summaryText),
    });
  }

  getWeeklySummary(form: WeeklySummaryFormGroup): IWeeklySummary | NewWeeklySummary {
    return form.getRawValue() as IWeeklySummary | NewWeeklySummary;
  }

  resetForm(form: WeeklySummaryFormGroup, weeklySummary: WeeklySummaryFormGroupInput): void {
    const weeklySummaryRawValue = { ...this.getFormDefaults(), ...weeklySummary };
    form.reset(
      {
        ...weeklySummaryRawValue,
        id: { value: weeklySummaryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WeeklySummaryFormDefaults {
    return {
      id: null,
    };
  }
}
