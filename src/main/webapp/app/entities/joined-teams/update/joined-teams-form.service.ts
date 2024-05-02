import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJoinedTeams, NewJoinedTeams } from '../joined-teams.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJoinedTeams for edit and NewJoinedTeamsFormGroupInput for create.
 */
type JoinedTeamsFormGroupInput = IJoinedTeams | PartialWithRequiredKeyOf<NewJoinedTeams>;

type JoinedTeamsFormDefaults = Pick<NewJoinedTeams, 'id'>;

type JoinedTeamsFormGroupContent = {
  id: FormControl<IJoinedTeams['id'] | NewJoinedTeams['id']>;
  teamID: FormControl<IJoinedTeams['teamID']>;
  name: FormControl<IJoinedTeams['name']>;
  description: FormControl<IJoinedTeams['description']>;
  memberSince: FormControl<IJoinedTeams['memberSince']>;
};

export type JoinedTeamsFormGroup = FormGroup<JoinedTeamsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JoinedTeamsFormService {
  createJoinedTeamsFormGroup(joinedTeams: JoinedTeamsFormGroupInput = { id: null }): JoinedTeamsFormGroup {
    const joinedTeamsRawValue = {
      ...this.getFormDefaults(),
      ...joinedTeams,
    };
    return new FormGroup<JoinedTeamsFormGroupContent>({
      id: new FormControl(
        { value: joinedTeamsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      teamID: new FormControl(joinedTeamsRawValue.teamID),
      name: new FormControl(joinedTeamsRawValue.name),
      description: new FormControl(joinedTeamsRawValue.description),
      memberSince: new FormControl(joinedTeamsRawValue.memberSince),
    });
  }

  getJoinedTeams(form: JoinedTeamsFormGroup): IJoinedTeams | NewJoinedTeams {
    return form.getRawValue() as IJoinedTeams | NewJoinedTeams;
  }

  resetForm(form: JoinedTeamsFormGroup, joinedTeams: JoinedTeamsFormGroupInput): void {
    const joinedTeamsRawValue = { ...this.getFormDefaults(), ...joinedTeams };
    form.reset(
      {
        ...joinedTeamsRawValue,
        id: { value: joinedTeamsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JoinedTeamsFormDefaults {
    return {
      id: null,
    };
  }
}
