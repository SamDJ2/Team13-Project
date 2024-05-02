import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProfileCustomization, NewProfileCustomization } from '../profile-customization.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProfileCustomization for edit and NewProfileCustomizationFormGroupInput for create.
 */
type ProfileCustomizationFormGroupInput = IProfileCustomization | PartialWithRequiredKeyOf<NewProfileCustomization>;

type ProfileCustomizationFormDefaults = Pick<NewProfileCustomization, 'id' | 'preferences' | 'privacySettings'>;

type ProfileCustomizationFormGroupContent = {
  id: FormControl<IProfileCustomization['id'] | NewProfileCustomization['id']>;
  preferences: FormControl<IProfileCustomization['preferences']>;
  privacySettings: FormControl<IProfileCustomization['privacySettings']>;
  accountHistory: FormControl<IProfileCustomization['accountHistory']>;
  bioDescription: FormControl<IProfileCustomization['bioDescription']>;
  joinedTeams: FormControl<IProfileCustomization['joinedTeams']>;
  setting: FormControl<IProfileCustomization['setting']>;
  achievement: FormControl<IProfileCustomization['achievement']>;
};

export type ProfileCustomizationFormGroup = FormGroup<ProfileCustomizationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProfileCustomizationFormService {
  createProfileCustomizationFormGroup(
    profileCustomization: ProfileCustomizationFormGroupInput = { id: null }
  ): ProfileCustomizationFormGroup {
    const profileCustomizationRawValue = {
      ...this.getFormDefaults(),
      ...profileCustomization,
    };
    return new FormGroup<ProfileCustomizationFormGroupContent>({
      id: new FormControl(
        { value: profileCustomizationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      preferences: new FormControl(profileCustomizationRawValue.preferences),
      privacySettings: new FormControl(profileCustomizationRawValue.privacySettings),
      accountHistory: new FormControl(profileCustomizationRawValue.accountHistory),
      bioDescription: new FormControl(profileCustomizationRawValue.bioDescription),
      joinedTeams: new FormControl(profileCustomizationRawValue.joinedTeams),
      setting: new FormControl(profileCustomizationRawValue.setting),
      achievement: new FormControl(profileCustomizationRawValue.achievement),
    });
  }

  getProfileCustomization(form: ProfileCustomizationFormGroup): IProfileCustomization | NewProfileCustomization {
    return form.getRawValue() as IProfileCustomization | NewProfileCustomization;
  }

  resetForm(form: ProfileCustomizationFormGroup, profileCustomization: ProfileCustomizationFormGroupInput): void {
    const profileCustomizationRawValue = { ...this.getFormDefaults(), ...profileCustomization };
    form.reset(
      {
        ...profileCustomizationRawValue,
        id: { value: profileCustomizationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProfileCustomizationFormDefaults {
    return {
      id: null,
      preferences: false,
      privacySettings: false,
    };
  }
}
