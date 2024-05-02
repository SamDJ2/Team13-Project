import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEmotionPage, NewEmotionPage } from '../emotion-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEmotionPage for edit and NewEmotionPageFormGroupInput for create.
 */
type EmotionPageFormGroupInput = IEmotionPage | PartialWithRequiredKeyOf<NewEmotionPage>;

type EmotionPageFormDefaults = Pick<NewEmotionPage, 'id'>;

type EmotionPageFormGroupContent = {
  id: FormControl<IEmotionPage['id'] | NewEmotionPage['id']>;
  prompts: FormControl<IEmotionPage['prompts']>;
  date: FormControl<IEmotionPage['date']>;
  promptedEntry: FormControl<IEmotionPage['promptedEntry']>;
  currentTab: FormControl<IEmotionPage['currentTab']>;
  moodPicker: FormControl<IEmotionPage['moodPicker']>;
};

export type EmotionPageFormGroup = FormGroup<EmotionPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EmotionPageFormService {
  createEmotionPageFormGroup(emotionPage: EmotionPageFormGroupInput = { id: null }): EmotionPageFormGroup {
    const emotionPageRawValue = {
      ...this.getFormDefaults(),
      ...emotionPage,
    };
    return new FormGroup<EmotionPageFormGroupContent>({
      id: new FormControl(
        { value: emotionPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      prompts: new FormControl(emotionPageRawValue.prompts),
      date: new FormControl(emotionPageRawValue.date),
      promptedEntry: new FormControl(emotionPageRawValue.promptedEntry),
      currentTab: new FormControl(emotionPageRawValue.currentTab),
      moodPicker: new FormControl(emotionPageRawValue.moodPicker),
    });
  }

  getEmotionPage(form: EmotionPageFormGroup): IEmotionPage | NewEmotionPage {
    return form.getRawValue() as IEmotionPage | NewEmotionPage;
  }

  resetForm(form: EmotionPageFormGroup, emotionPage: EmotionPageFormGroupInput): void {
    const emotionPageRawValue = { ...this.getFormDefaults(), ...emotionPage };
    form.reset(
      {
        ...emotionPageRawValue,
        id: { value: emotionPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EmotionPageFormDefaults {
    return {
      id: null,
    };
  }
}
