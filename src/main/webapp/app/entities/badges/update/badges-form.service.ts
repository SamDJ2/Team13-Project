import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IBadges, NewBadges } from '../badges.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IBadges for edit and NewBadgesFormGroupInput for create.
 */
type BadgesFormGroupInput = IBadges | PartialWithRequiredKeyOf<NewBadges>;

type BadgesFormDefaults = Pick<NewBadges, 'id'>;

type BadgesFormGroupContent = {
  id: FormControl<IBadges['id'] | NewBadges['id']>;
  badgeNo: FormControl<IBadges['badgeNo']>;
  requiredPoints: FormControl<IBadges['requiredPoints']>;
  badge: FormControl<IBadges['badge']>;
  badgeContentType: FormControl<IBadges['badgeContentType']>;
  grouping: FormControl<IBadges['grouping']>;
};

export type BadgesFormGroup = FormGroup<BadgesFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BadgesFormService {
  createBadgesFormGroup(badges: BadgesFormGroupInput = { id: null }): BadgesFormGroup {
    const badgesRawValue = {
      ...this.getFormDefaults(),
      ...badges,
    };
    return new FormGroup<BadgesFormGroupContent>({
      id: new FormControl(
        { value: badgesRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      badgeNo: new FormControl(badgesRawValue.badgeNo),
      requiredPoints: new FormControl(badgesRawValue.requiredPoints),
      badge: new FormControl(badgesRawValue.badge),
      badgeContentType: new FormControl(badgesRawValue.badgeContentType),
      grouping: new FormControl(badgesRawValue.grouping),
    });
  }

  getBadges(form: BadgesFormGroup): IBadges | NewBadges {
    return form.getRawValue() as IBadges | NewBadges;
  }

  resetForm(form: BadgesFormGroup, badges: BadgesFormGroupInput): void {
    const badgesRawValue = { ...this.getFormDefaults(), ...badges };
    form.reset(
      {
        ...badgesRawValue,
        id: { value: badgesRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): BadgesFormDefaults {
    return {
      id: null,
    };
  }
}
