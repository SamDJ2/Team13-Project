import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILandingPage, NewLandingPage } from '../landing-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILandingPage for edit and NewLandingPageFormGroupInput for create.
 */
type LandingPageFormGroupInput = ILandingPage | PartialWithRequiredKeyOf<NewLandingPage>;

type LandingPageFormDefaults = Pick<NewLandingPage, 'id'>;

type LandingPageFormGroupContent = {
  id: FormControl<ILandingPage['id'] | NewLandingPage['id']>;
  getStarted: FormControl<ILandingPage['getStarted']>;
  about: FormControl<ILandingPage['about']>;
  team: FormControl<ILandingPage['team']>;
  contact: FormControl<ILandingPage['contact']>;
  moodPicker: FormControl<ILandingPage['moodPicker']>;
};

export type LandingPageFormGroup = FormGroup<LandingPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LandingPageFormService {
  createLandingPageFormGroup(landingPage: LandingPageFormGroupInput = { id: null }): LandingPageFormGroup {
    const landingPageRawValue = {
      ...this.getFormDefaults(),
      ...landingPage,
    };
    return new FormGroup<LandingPageFormGroupContent>({
      id: new FormControl(
        { value: landingPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      getStarted: new FormControl(landingPageRawValue.getStarted),
      about: new FormControl(landingPageRawValue.about),
      team: new FormControl(landingPageRawValue.team),
      contact: new FormControl(landingPageRawValue.contact),
      moodPicker: new FormControl(landingPageRawValue.moodPicker),
    });
  }

  getLandingPage(form: LandingPageFormGroup): ILandingPage | NewLandingPage {
    return form.getRawValue() as ILandingPage | NewLandingPage;
  }

  resetForm(form: LandingPageFormGroup, landingPage: LandingPageFormGroupInput): void {
    const landingPageRawValue = { ...this.getFormDefaults(), ...landingPage };
    form.reset(
      {
        ...landingPageRawValue,
        id: { value: landingPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LandingPageFormDefaults {
    return {
      id: null,
    };
  }
}
