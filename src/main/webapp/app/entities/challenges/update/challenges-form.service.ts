import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IChallenges, NewChallenges } from '../challenges.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChallenges for edit and NewChallengesFormGroupInput for create.
 */
type ChallengesFormGroupInput = IChallenges | PartialWithRequiredKeyOf<NewChallenges>;

type ChallengesFormDefaults = Pick<NewChallenges, 'id' | 'selectChallenge' | 'searches' | 'filtereds'>;

type ChallengesFormGroupContent = {
  id: FormControl<IChallenges['id'] | NewChallenges['id']>;
  selectChallenge: FormControl<IChallenges['selectChallenge']>;
  allChallenges: FormControl<IChallenges['allChallenges']>;
  progress: FormControl<IChallenges['progress']>;
  junkFood: FormControl<IChallenges['junkFood']>;
  screenTime: FormControl<IChallenges['screenTime']>;
  alcohol: FormControl<IChallenges['alcohol']>;
  smoking: FormControl<IChallenges['smoking']>;
  searches: FormControl<IChallenges['searches']>;
  filtereds: FormControl<IChallenges['filtereds']>;
};

export type ChallengesFormGroup = FormGroup<ChallengesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChallengesFormService {
  createChallengesFormGroup(challenges: ChallengesFormGroupInput = { id: null }): ChallengesFormGroup {
    const challengesRawValue = {
      ...this.getFormDefaults(),
      ...challenges,
    };
    return new FormGroup<ChallengesFormGroupContent>({
      id: new FormControl(
        { value: challengesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      selectChallenge: new FormControl(challengesRawValue.selectChallenge),
      allChallenges: new FormControl(challengesRawValue.allChallenges),
      progress: new FormControl(challengesRawValue.progress),
      junkFood: new FormControl(challengesRawValue.junkFood),
      screenTime: new FormControl(challengesRawValue.screenTime),
      alcohol: new FormControl(challengesRawValue.alcohol),
      smoking: new FormControl(challengesRawValue.smoking),
      searches: new FormControl(challengesRawValue.searches ?? []),
      filtereds: new FormControl(challengesRawValue.filtereds ?? []),
    });
  }

  getChallenges(form: ChallengesFormGroup): IChallenges | NewChallenges {
    return form.getRawValue() as IChallenges | NewChallenges;
  }

  resetForm(form: ChallengesFormGroup, challenges: ChallengesFormGroupInput): void {
    const challengesRawValue = { ...this.getFormDefaults(), ...challenges };
    form.reset(
      {
        ...challengesRawValue,
        id: { value: challengesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChallengesFormDefaults {
    return {
      id: null,
      selectChallenge: false,
      searches: [],
      filtereds: [],
    };
  }
}
