import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IMoodJournalPage, NewMoodJournalPage } from '../mood-journal-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMoodJournalPage for edit and NewMoodJournalPageFormGroupInput for create.
 */
type MoodJournalPageFormGroupInput = IMoodJournalPage | PartialWithRequiredKeyOf<NewMoodJournalPage>;

type MoodJournalPageFormDefaults = Pick<NewMoodJournalPage, 'id'>;

type MoodJournalPageFormGroupContent = {
  id: FormControl<IMoodJournalPage['id'] | NewMoodJournalPage['id']>;
  allEntries: FormControl<IMoodJournalPage['allEntries']>;
  date: FormControl<IMoodJournalPage['date']>;
  currentTab: FormControl<IMoodJournalPage['currentTab']>;
};

export type MoodJournalPageFormGroup = FormGroup<MoodJournalPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MoodJournalPageFormService {
  createMoodJournalPageFormGroup(moodJournalPage: MoodJournalPageFormGroupInput = { id: null }): MoodJournalPageFormGroup {
    const moodJournalPageRawValue = {
      ...this.getFormDefaults(),
      ...moodJournalPage,
    };
    return new FormGroup<MoodJournalPageFormGroupContent>({
      id: new FormControl(
        { value: moodJournalPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      allEntries: new FormControl(moodJournalPageRawValue.allEntries),
      date: new FormControl(moodJournalPageRawValue.date),
      currentTab: new FormControl(moodJournalPageRawValue.currentTab),
    });
  }

  getMoodJournalPage(form: MoodJournalPageFormGroup): IMoodJournalPage | NewMoodJournalPage {
    return form.getRawValue() as IMoodJournalPage | NewMoodJournalPage;
  }

  resetForm(form: MoodJournalPageFormGroup, moodJournalPage: MoodJournalPageFormGroupInput): void {
    const moodJournalPageRawValue = { ...this.getFormDefaults(), ...moodJournalPage };
    form.reset(
      {
        ...moodJournalPageRawValue,
        id: { value: moodJournalPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): MoodJournalPageFormDefaults {
    return {
      id: null,
    };
  }
}
