import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IAchievement, NewAchievement } from '../achievement.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IAchievement for edit and NewAchievementFormGroupInput for create.
 */
type AchievementFormGroupInput = IAchievement | PartialWithRequiredKeyOf<NewAchievement>;

type AchievementFormDefaults = Pick<NewAchievement, 'id'>;

type AchievementFormGroupContent = {
  id: FormControl<IAchievement['id'] | NewAchievement['id']>;
  achievementID: FormControl<IAchievement['achievementID']>;
  name: FormControl<IAchievement['name']>;
  description: FormControl<IAchievement['description']>;
  dateEarned: FormControl<IAchievement['dateEarned']>;
  achievementType: FormControl<IAchievement['achievementType']>;
};

export type AchievementFormGroup = FormGroup<AchievementFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class AchievementFormService {
  createAchievementFormGroup(achievement: AchievementFormGroupInput = { id: null }): AchievementFormGroup {
    const achievementRawValue = {
      ...this.getFormDefaults(),
      ...achievement,
    };
    return new FormGroup<AchievementFormGroupContent>({
      id: new FormControl(
        { value: achievementRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      achievementID: new FormControl(achievementRawValue.achievementID),
      name: new FormControl(achievementRawValue.name),
      description: new FormControl(achievementRawValue.description),
      dateEarned: new FormControl(achievementRawValue.dateEarned),
      achievementType: new FormControl(achievementRawValue.achievementType),
    });
  }

  getAchievement(form: AchievementFormGroup): IAchievement | NewAchievement {
    return form.getRawValue() as IAchievement | NewAchievement;
  }

  resetForm(form: AchievementFormGroup, achievement: AchievementFormGroupInput): void {
    const achievementRawValue = { ...this.getFormDefaults(), ...achievement };
    form.reset(
      {
        ...achievementRawValue,
        id: { value: achievementRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): AchievementFormDefaults {
    return {
      id: null,
    };
  }
}
