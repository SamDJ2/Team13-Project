import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEntriesPage, NewEntriesPage } from '../entries-page.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEntriesPage for edit and NewEntriesPageFormGroupInput for create.
 */
type EntriesPageFormGroupInput = IEntriesPage | PartialWithRequiredKeyOf<NewEntriesPage>;

type EntriesPageFormDefaults = Pick<NewEntriesPage, 'id'>;

type EntriesPageFormGroupContent = {
  id: FormControl<IEntriesPage['id'] | NewEntriesPage['id']>;
  normalEntries: FormControl<IEntriesPage['normalEntries']>;
  date: FormControl<IEntriesPage['date']>;
  currentTab: FormControl<IEntriesPage['currentTab']>;
  moodJournalPage: FormControl<IEntriesPage['moodJournalPage']>;
};

export type EntriesPageFormGroup = FormGroup<EntriesPageFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EntriesPageFormService {
  createEntriesPageFormGroup(entriesPage: EntriesPageFormGroupInput = { id: null }): EntriesPageFormGroup {
    const entriesPageRawValue = {
      ...this.getFormDefaults(),
      ...entriesPage,
    };
    return new FormGroup<EntriesPageFormGroupContent>({
      id: new FormControl(
        { value: entriesPageRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      normalEntries: new FormControl(entriesPageRawValue.normalEntries),
      date: new FormControl(entriesPageRawValue.date),
      currentTab: new FormControl(entriesPageRawValue.currentTab),
      moodJournalPage: new FormControl(entriesPageRawValue.moodJournalPage),
    });
  }

  getEntriesPage(form: EntriesPageFormGroup): IEntriesPage | NewEntriesPage {
    return form.getRawValue() as IEntriesPage | NewEntriesPage;
  }

  resetForm(form: EntriesPageFormGroup, entriesPage: EntriesPageFormGroupInput): void {
    const entriesPageRawValue = { ...this.getFormDefaults(), ...entriesPage };
    form.reset(
      {
        ...entriesPageRawValue,
        id: { value: entriesPageRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EntriesPageFormDefaults {
    return {
      id: null,
    };
  }
}
