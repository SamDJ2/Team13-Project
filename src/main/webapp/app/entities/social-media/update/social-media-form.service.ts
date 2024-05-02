import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISocialMedia, NewSocialMedia } from '../social-media.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISocialMedia for edit and NewSocialMediaFormGroupInput for create.
 */
type SocialMediaFormGroupInput = ISocialMedia | PartialWithRequiredKeyOf<NewSocialMedia>;

type SocialMediaFormDefaults = Pick<NewSocialMedia, 'id'>;

type SocialMediaFormGroupContent = {
  id: FormControl<ISocialMedia['id'] | NewSocialMedia['id']>;
  levels: FormControl<ISocialMedia['levels']>;
  progress: FormControl<ISocialMedia['progress']>;
  timer: FormControl<ISocialMedia['timer']>;
};

export type SocialMediaFormGroup = FormGroup<SocialMediaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SocialMediaFormService {
  createSocialMediaFormGroup(socialMedia: SocialMediaFormGroupInput = { id: null }): SocialMediaFormGroup {
    const socialMediaRawValue = {
      ...this.getFormDefaults(),
      ...socialMedia,
    };
    return new FormGroup<SocialMediaFormGroupContent>({
      id: new FormControl(
        { value: socialMediaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      levels: new FormControl(socialMediaRawValue.levels),
      progress: new FormControl(socialMediaRawValue.progress),
      timer: new FormControl(socialMediaRawValue.timer),
    });
  }

  getSocialMedia(form: SocialMediaFormGroup): ISocialMedia | NewSocialMedia {
    return form.getRawValue() as ISocialMedia | NewSocialMedia;
  }

  resetForm(form: SocialMediaFormGroup, socialMedia: SocialMediaFormGroupInput): void {
    const socialMediaRawValue = { ...this.getFormDefaults(), ...socialMedia };
    form.reset(
      {
        ...socialMediaRawValue,
        id: { value: socialMediaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SocialMediaFormDefaults {
    return {
      id: null,
    };
  }
}
