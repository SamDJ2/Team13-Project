import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMembers, NewMembers } from '../members.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMembers for edit and NewMembersFormGroupInput for create.
 */
type MembersFormGroupInput = IMembers | PartialWithRequiredKeyOf<NewMembers>;

type MembersFormDefaults = Pick<NewMembers, 'id' | 'leader'>;

type MembersFormGroupContent = {
  id: FormControl<IMembers['id'] | NewMembers['id']>;
  groupID: FormControl<IMembers['groupID']>;
  userID: FormControl<IMembers['userID']>;
  leader: FormControl<IMembers['leader']>;
  grouping: FormControl<IMembers['grouping']>;
};

export type MembersFormGroup = FormGroup<MembersFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MembersFormService {
  createMembersFormGroup(members: MembersFormGroupInput = { id: null }): MembersFormGroup {
    const membersRawValue = {
      ...this.getFormDefaults(),
      ...members,
    };
    return new FormGroup<MembersFormGroupContent>({
      id: new FormControl(
        { value: membersRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      groupID: new FormControl(membersRawValue.groupID),
      userID: new FormControl(membersRawValue.userID),
      leader: new FormControl(membersRawValue.leader),
      grouping: new FormControl(membersRawValue.grouping),
    });
  }

  getMembers(form: MembersFormGroup): IMembers | NewMembers {
    return form.getRawValue() as IMembers | NewMembers;
  }

  resetForm(form: MembersFormGroup, members: MembersFormGroupInput): void {
    const membersRawValue = { ...this.getFormDefaults(), ...members };
    form.reset(
      {
        ...membersRawValue,
        id: { value: membersRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MembersFormDefaults {
    return {
      id: null,
      leader: false,
    };
  }
}
