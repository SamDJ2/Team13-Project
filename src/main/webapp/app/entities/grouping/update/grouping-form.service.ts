import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGrouping, NewGrouping } from '../grouping.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGrouping for edit and NewGroupingFormGroupInput for create.
 */
type GroupingFormGroupInput = IGrouping | PartialWithRequiredKeyOf<NewGrouping>;

type GroupingFormDefaults = Pick<NewGrouping, 'id'>;

type GroupingFormGroupContent = {
  id: FormControl<IGrouping['id'] | NewGrouping['id']>;
  iD: FormControl<IGrouping['iD']>;
  groupingName: FormControl<IGrouping['groupingName']>;
  groupingPoints: FormControl<IGrouping['groupingPoints']>;
  remainingTime: FormControl<IGrouping['remainingTime']>;
  currentDate: FormControl<IGrouping['currentDate']>;
};

export type GroupingFormGroup = FormGroup<GroupingFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GroupingFormService {
  createGroupingFormGroup(grouping: GroupingFormGroupInput = { id: null }): GroupingFormGroup {
    const groupingRawValue = {
      ...this.getFormDefaults(),
      ...grouping,
    };
    return new FormGroup<GroupingFormGroupContent>({
      id: new FormControl(
        { value: groupingRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      iD: new FormControl(groupingRawValue.iD),
      groupingName: new FormControl(groupingRawValue.groupingName),
      groupingPoints: new FormControl(groupingRawValue.groupingPoints),
      remainingTime: new FormControl(groupingRawValue.remainingTime),
      currentDate: new FormControl(groupingRawValue.currentDate),
    });
  }

  getGrouping(form: GroupingFormGroup): IGrouping | NewGrouping {
    return form.getRawValue() as IGrouping | NewGrouping;
  }

  resetForm(form: GroupingFormGroup, grouping: GroupingFormGroupInput): void {
    const groupingRawValue = { ...this.getFormDefaults(), ...grouping };
    form.reset(
      {
        ...groupingRawValue,
        id: { value: groupingRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GroupingFormDefaults {
    return {
      id: null,
    };
  }
}
