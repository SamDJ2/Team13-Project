import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IUserPoints, NewUserPoints } from '../user-points.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IUserPoints for edit and NewUserPointsFormGroupInput for create.
 */
type UserPointsFormGroupInput = IUserPoints | PartialWithRequiredKeyOf<NewUserPoints>;

type UserPointsFormDefaults = Pick<NewUserPoints, 'id'>;

type UserPointsFormGroupContent = {
  id: FormControl<IUserPoints['id'] | NewUserPoints['id']>;
  userID: FormControl<IUserPoints['userID']>;
  currentPoints: FormControl<IUserPoints['currentPoints']>;
  previousPoints: FormControl<IUserPoints['previousPoints']>;
  totalPoints: FormControl<IUserPoints['totalPoints']>;
  leaderBoards: FormControl<IUserPoints['leaderBoards']>;
};

export type UserPointsFormGroup = FormGroup<UserPointsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class UserPointsFormService {
  createUserPointsFormGroup(userPoints: UserPointsFormGroupInput = { id: null }): UserPointsFormGroup {
    const userPointsRawValue = {
      ...this.getFormDefaults(),
      ...userPoints,
    };
    return new FormGroup<UserPointsFormGroupContent>({
      id: new FormControl(
        { value: userPointsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      userID: new FormControl(userPointsRawValue.userID),
      currentPoints: new FormControl(userPointsRawValue.currentPoints),
      previousPoints: new FormControl(userPointsRawValue.previousPoints),
      totalPoints: new FormControl(userPointsRawValue.totalPoints),
      leaderBoards: new FormControl(userPointsRawValue.leaderBoards),
    });
  }

  getUserPoints(form: UserPointsFormGroup): IUserPoints | NewUserPoints {
    return form.getRawValue() as IUserPoints | NewUserPoints;
  }

  resetForm(form: UserPointsFormGroup, userPoints: UserPointsFormGroupInput): void {
    const userPointsRawValue = { ...this.getFormDefaults(), ...userPoints };
    form.reset(
      {
        ...userPointsRawValue,
        id: { value: userPointsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): UserPointsFormDefaults {
    return {
      id: null,
    };
  }
}
