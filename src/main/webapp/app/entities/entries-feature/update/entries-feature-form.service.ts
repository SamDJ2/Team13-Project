import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { EntriesFeature, NewEntriesFeature } from '../entries-feature.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEntriesFeature for edit and NewEntriesFeatureFormGroupInput for create.
 */
type EntriesFeatureFormGroupInput = EntriesFeature | PartialWithRequiredKeyOf<NewEntriesFeature>;

type EntriesFeatureFormDefaults = Pick<NewEntriesFeature, 'id'>;

type EntriesFeatureFormGroupContent = {
  id: FormControl<EntriesFeature['id'] | NewEntriesFeature['id']>;
  title: FormControl<EntriesFeature['title']>;
  content: FormControl<EntriesFeature['content']>;
  date: FormControl<EntriesFeature['date']>;
};

export type EntriesFeatureFormGroup = FormGroup<EntriesFeatureFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EntriesFeatureFormService {
  createEntriesFeatureFormGroup(entriesFeature: EntriesFeatureFormGroupInput = { id: null }): EntriesFeatureFormGroup {
    const entriesFeatureRawValue = {
      ...this.getFormDefaults(),
      ...entriesFeature,
    };
    return new FormGroup<EntriesFeatureFormGroupContent>({
      id: new FormControl(
        { value: entriesFeatureRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      title: new FormControl(entriesFeatureRawValue.title),
      content: new FormControl(entriesFeatureRawValue.content),
      date: new FormControl(entriesFeatureRawValue.date),
    });
  }

  getEntriesFeature(form: EntriesFeatureFormGroup): EntriesFeature | NewEntriesFeature {
    return form.getRawValue() as EntriesFeature | NewEntriesFeature;
  }

  resetForm(form: EntriesFeatureFormGroup, entriesFeature: EntriesFeatureFormGroupInput): void {
    const entriesFeatureRawValue = { ...this.getFormDefaults(), ...entriesFeature };
    form.reset(
      {
        ...entriesFeatureRawValue,
        id: { value: entriesFeatureRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EntriesFeatureFormDefaults {
    return {
      id: null,
    };
  }
}
