import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { INavigationPortal, NewNavigationPortal } from '../navigation-portal.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts INavigationPortal for edit and NewNavigationPortalFormGroupInput for create.
 */
type NavigationPortalFormGroupInput = INavigationPortal | PartialWithRequiredKeyOf<NewNavigationPortal>;

type NavigationPortalFormDefaults = Pick<NewNavigationPortal, 'id' | 'selectedFeature'>;

type NavigationPortalFormGroupContent = {
  id: FormControl<INavigationPortal['id'] | NewNavigationPortal['id']>;
  features: FormControl<INavigationPortal['features']>;
  selectedFeature: FormControl<INavigationPortal['selectedFeature']>;
  challenges: FormControl<INavigationPortal['challenges']>;
  habit: FormControl<INavigationPortal['habit']>;
  leaderBoards: FormControl<INavigationPortal['leaderBoards']>;
  profileCustomization: FormControl<INavigationPortal['profileCustomization']>;
  moodJournalPage: FormControl<INavigationPortal['moodJournalPage']>;
};

export type NavigationPortalFormGroup = FormGroup<NavigationPortalFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class NavigationPortalFormService {
  createNavigationPortalFormGroup(navigationPortal: NavigationPortalFormGroupInput = { id: null }): NavigationPortalFormGroup {
    const navigationPortalRawValue = {
      ...this.getFormDefaults(),
      ...navigationPortal,
    };
    return new FormGroup<NavigationPortalFormGroupContent>({
      id: new FormControl(
        { value: navigationPortalRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      features: new FormControl(navigationPortalRawValue.features),
      selectedFeature: new FormControl(navigationPortalRawValue.selectedFeature),
      challenges: new FormControl(navigationPortalRawValue.challenges),
      habit: new FormControl(navigationPortalRawValue.habit),
      leaderBoards: new FormControl(navigationPortalRawValue.leaderBoards),
      profileCustomization: new FormControl(navigationPortalRawValue.profileCustomization),
      moodJournalPage: new FormControl(navigationPortalRawValue.moodJournalPage),
    });
  }

  getNavigationPortal(form: NavigationPortalFormGroup): INavigationPortal | NewNavigationPortal {
    return form.getRawValue() as INavigationPortal | NewNavigationPortal;
  }

  resetForm(form: NavigationPortalFormGroup, navigationPortal: NavigationPortalFormGroupInput): void {
    const navigationPortalRawValue = { ...this.getFormDefaults(), ...navigationPortal };
    form.reset(
      {
        ...navigationPortalRawValue,
        id: { value: navigationPortalRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): NavigationPortalFormDefaults {
    return {
      id: null,
      selectedFeature: false,
    };
  }
}
