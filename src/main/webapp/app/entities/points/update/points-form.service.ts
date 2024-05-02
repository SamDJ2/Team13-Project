import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPoints, NewPoints } from '../points.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPoints for edit and NewPointsFormGroupInput for create.
 */
type PointsFormGroupInput = IPoints | PartialWithRequiredKeyOf<NewPoints>;

type PointsFormDefaults = Pick<NewPoints, 'id'>;

type PointsFormGroupContent = {
  id: FormControl<IPoints['id'] | NewPoints['id']>;
  username: FormControl<IPoints['username']>;
  currentPoints: FormControl<IPoints['currentPoints']>;
  previousPoints: FormControl<IPoints['previousPoints']>;
  totalPoints: FormControl<IPoints['totalPoints']>;
  leaderBoards: FormControl<IPoints['leaderBoards']>;
};

export type PointsFormGroup = FormGroup<PointsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PointsFormService {
  createPointsFormGroup(points: PointsFormGroupInput = { id: null }): PointsFormGroup {
    const pointsRawValue = {
      ...this.getFormDefaults(),
      ...points,
    };
    return new FormGroup<PointsFormGroupContent>({
      id: new FormControl(
        { value: pointsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      username: new FormControl(pointsRawValue.username),
      currentPoints: new FormControl(pointsRawValue.currentPoints),
      previousPoints: new FormControl(pointsRawValue.previousPoints),
      totalPoints: new FormControl(pointsRawValue.totalPoints),
      leaderBoards: new FormControl(pointsRawValue.leaderBoards),
    });
  }

  getPoints(form: PointsFormGroup): IPoints | NewPoints {
    return form.getRawValue() as IPoints | NewPoints;
  }

  resetForm(form: PointsFormGroup, points: PointsFormGroupInput): void {
    const pointsRawValue = { ...this.getFormDefaults(), ...points };
    form.reset(
      {
        ...pointsRawValue,
        id: { value: pointsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PointsFormDefaults {
    return {
      id: null,
    };
  }
}
