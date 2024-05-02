import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { PromptsFeature, NewPromptsFeature } from '../prompts-feature.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPromptsFeature for edit and NewPromptsFeatureFormGroupInput for create.
 */
type PromptsFeatureFormGroupInput = PromptsFeature | PartialWithRequiredKeyOf<NewPromptsFeature>;

type PromptsFeatureFormDefaults = Pick<NewPromptsFeature, 'id'>;

type PromptsFeatureFormGroupContent = {
  id: FormControl<PromptsFeature['id'] | NewPromptsFeature['id']>;
  title: FormControl<PromptsFeature['title']>;
  prompt: FormControl<PromptsFeature['prompt']>;
  content: FormControl<PromptsFeature['content']>;
  date: FormControl<PromptsFeature['date']>;
};

export type PromptsFeatureFormGroup = FormGroup<PromptsFeatureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PromptsFeatureFormService {
  createPromptsFeatureFormGroup(promptsFeature: PromptsFeatureFormGroupInput = { id: null }): PromptsFeatureFormGroup {
    const promptsFeatureRawValue = {
      ...this.getFormDefaults(),
      ...promptsFeature,
    };
    return new FormGroup<PromptsFeatureFormGroupContent>({
      id: new FormControl(
        { value: promptsFeatureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(promptsFeatureRawValue.title),
      prompt: new FormControl(promptsFeatureRawValue.prompt),
      content: new FormControl(promptsFeatureRawValue.content),
      date: new FormControl(promptsFeatureRawValue.date),
    });
  }

  getPromptsFeature(form: PromptsFeatureFormGroup): PromptsFeature | NewPromptsFeature {
    return form.getRawValue() as PromptsFeature | NewPromptsFeature;
  }

  resetForm(form: PromptsFeatureFormGroup, promptsFeature: PromptsFeatureFormGroupInput): void {
    const promptsFeatureRawValue = { ...this.getFormDefaults(), ...promptsFeature };
    form.reset(
      {
        ...promptsFeatureRawValue,
        id: { value: promptsFeatureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PromptsFeatureFormDefaults {
    return {
      id: null,
    };
  }
}
