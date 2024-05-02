import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPromptsPage, NewPromptsPage } from '../prompts-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPromptsPage for edit and NewPromptsPageFormGroupInput for create.
 */
type PromptsPageFormGroupInput = IPromptsPage | PartialWithRequiredKeyOf<NewPromptsPage>;

type PromptsPageFormDefaults = Pick<NewPromptsPage, 'id'>;

type PromptsPageFormGroupContent = {
  id: FormControl<IPromptsPage['id'] | NewPromptsPage['id']>;
  promptedEntries: FormControl<IPromptsPage['promptedEntries']>;
  date: FormControl<IPromptsPage['date']>;
  emotionFromMoodPicker: FormControl<IPromptsPage['emotionFromMoodPicker']>;
  currentTab: FormControl<IPromptsPage['currentTab']>;
  moodPicker: FormControl<IPromptsPage['moodPicker']>;
  emotionPage: FormControl<IPromptsPage['emotionPage']>;
  moodJournalPage: FormControl<IPromptsPage['moodJournalPage']>;
};

export type PromptsPageFormGroup = FormGroup<PromptsPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PromptsPageFormService {
  createPromptsPageFormGroup(promptsPage: PromptsPageFormGroupInput = { id: null }): PromptsPageFormGroup {
    const promptsPageRawValue = {
      ...this.getFormDefaults(),
      ...promptsPage,
    };
    return new FormGroup<PromptsPageFormGroupContent>({
      id: new FormControl(
        { value: promptsPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      promptedEntries: new FormControl(promptsPageRawValue.promptedEntries),
      date: new FormControl(promptsPageRawValue.date),
      emotionFromMoodPicker: new FormControl(promptsPageRawValue.emotionFromMoodPicker),
      currentTab: new FormControl(promptsPageRawValue.currentTab),
      moodPicker: new FormControl(promptsPageRawValue.moodPicker),
      emotionPage: new FormControl(promptsPageRawValue.emotionPage),
      moodJournalPage: new FormControl(promptsPageRawValue.moodJournalPage),
    });
  }

  getPromptsPage(form: PromptsPageFormGroup): IPromptsPage | NewPromptsPage {
    return form.getRawValue() as IPromptsPage | NewPromptsPage;
  }

  resetForm(form: PromptsPageFormGroup, promptsPage: PromptsPageFormGroupInput): void {
    const promptsPageRawValue = { ...this.getFormDefaults(), ...promptsPage };
    form.reset(
      {
        ...promptsPageRawValue,
        id: { value: promptsPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PromptsPageFormDefaults {
    return {
      id: null,
    };
  }
}
