import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISearch, NewSearch } from '../search.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISearch for edit and NewSearchFormGroupInput for create.
 */
type SearchFormGroupInput = ISearch | PartialWithRequiredKeyOf<NewSearch>;

type SearchFormDefaults = Pick<NewSearch, 'id' | 'challenges'>;

type SearchFormGroupContent = {
  id: FormControl<ISearch['id'] | NewSearch['id']>;
  search: FormControl<ISearch['search']>;
  results: FormControl<ISearch['results']>;
  challenges: FormControl<ISearch['challenges']>;
};

export type SearchFormGroup = FormGroup<SearchFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SearchFormService {
  createSearchFormGroup(search: SearchFormGroupInput = { id: null }): SearchFormGroup {
    const searchRawValue = {
      ...this.getFormDefaults(),
      ...search,
    };
    return new FormGroup<SearchFormGroupContent>({
      id: new FormControl(
        { value: searchRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      search: new FormControl(searchRawValue.search),
      results: new FormControl(searchRawValue.results),
      challenges: new FormControl(searchRawValue.challenges ?? []),
    });
  }

  getSearch(form: SearchFormGroup): ISearch | NewSearch {
    return form.getRawValue() as ISearch | NewSearch;
  }

  resetForm(form: SearchFormGroup, search: SearchFormGroupInput): void {
    const searchRawValue = { ...this.getFormDefaults(), ...search };
    form.reset(
      {
        ...searchRawValue,
        id: { value: searchRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SearchFormDefaults {
    return {
      id: null,
      challenges: [],
    };
  }
}
