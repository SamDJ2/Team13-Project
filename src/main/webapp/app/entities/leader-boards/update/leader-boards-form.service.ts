import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILeaderBoards, NewLeaderBoards } from '../leader-boards.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILeaderBoards for edit and NewLeaderBoardsFormGroupInput for create.
 */
type LeaderBoardsFormGroupInput = ILeaderBoards | PartialWithRequiredKeyOf<NewLeaderBoards>;

type LeaderBoardsFormDefaults = Pick<NewLeaderBoards, 'id'>;

type LeaderBoardsFormGroupContent = {
  id: FormControl<ILeaderBoards['id'] | NewLeaderBoards['id']>;
  standings: FormControl<ILeaderBoards['standings']>;
  grouping: FormControl<ILeaderBoards['grouping']>;
  progress: FormControl<ILeaderBoards['progress']>;
};

export type LeaderBoardsFormGroup = FormGroup<LeaderBoardsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LeaderBoardsFormService {
  createLeaderBoardsFormGroup(leaderBoards: LeaderBoardsFormGroupInput = { id: null }): LeaderBoardsFormGroup {
    const leaderBoardsRawValue = {
      ...this.getFormDefaults(),
      ...leaderBoards,
    };
    return new FormGroup<LeaderBoardsFormGroupContent>({
      id: new FormControl(
        { value: leaderBoardsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      standings: new FormControl(leaderBoardsRawValue.standings),
      grouping: new FormControl(leaderBoardsRawValue.grouping),
      progress: new FormControl(leaderBoardsRawValue.progress),
    });
  }

  getLeaderBoards(form: LeaderBoardsFormGroup): ILeaderBoards | NewLeaderBoards {
    return form.getRawValue() as ILeaderBoards | NewLeaderBoards;
  }

  resetForm(form: LeaderBoardsFormGroup, leaderBoards: LeaderBoardsFormGroupInput): void {
    const leaderBoardsRawValue = { ...this.getFormDefaults(), ...leaderBoards };
    form.reset(
      {
        ...leaderBoardsRawValue,
        id: { value: leaderBoardsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LeaderBoardsFormDefaults {
    return {
      id: null,
    };
  }
}
