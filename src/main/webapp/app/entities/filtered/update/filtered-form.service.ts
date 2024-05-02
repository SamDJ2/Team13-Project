import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IFiltered, NewFiltered } from '../filtered.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IFiltered for edit and NewFilteredFormGroupInput for create.
 */
type FilteredFormGroupInput = IFiltered | PartialWithRequiredKeyOf<NewFiltered>;

type FilteredFormDefaults = Pick<NewFiltered, 'id' | 'filtering' | 'challenges'>;

type FilteredFormGroupContent = {
  id: FormControl<IFiltered['id'] | NewFiltered['id']>;
  search: FormControl<IFiltered['search']>;
  results: FormControl<IFiltered['results']>;
  filtering: FormControl<IFiltered['filtering']>;
  challenges: FormControl<IFiltered['challenges']>;
};

export type FilteredFormGroup = FormGroup<FilteredFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class FilteredFormService {
  createFilteredFormGroup(filtered: FilteredFormGroupInput = { id: null }): FilteredFormGroup {
    const filteredRawValue = {
      ...this.getFormDefaults(),
      ...filtered,
    };
    return new FormGroup<FilteredFormGroupContent>({
      id: new FormControl(
        { value: filteredRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      search: new FormControl(filteredRawValue.search),
      results: new FormControl(filteredRawValue.results),
      filtering: new FormControl(filteredRawValue.filtering),
      challenges: new FormControl(filteredRawValue.challenges ?? []),
    });
  }

  getFiltered(form: FilteredFormGroup): IFiltered | NewFiltered {
    return form.getRawValue() as IFiltered | NewFiltered;
  }

  resetForm(form: FilteredFormGroup, filtered: FilteredFormGroupInput): void {
    const filteredRawValue = { ...this.getFormDefaults(), ...filtered };
    form.reset(
      {
        ...filteredRawValue,
        id: { value: filteredRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): FilteredFormDefaults {
    return {
      id: null,
      filtering: false,
      challenges: [],
    };
  }
}
