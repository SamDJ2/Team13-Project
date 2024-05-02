import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMoodPicker, NewMoodPicker } from '../mood-picker.model';

export type PartialUpdateMoodPicker = Partial<IMoodPicker> & Pick<IMoodPicker, 'id'>;

export type EntityResponseType = HttpResponse<IMoodPicker>;
export type EntityArrayResponseType = HttpResponse<IMoodPicker[]>;

@Injectable({ providedIn: 'root' })
export class MoodPickerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mood-pickers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(moodPicker: NewMoodPicker): Observable<EntityResponseType> {
    return this.http.post<IMoodPicker>(this.resourceUrl, moodPicker, { observe: 'response' });
  }

  update(moodPicker: IMoodPicker): Observable<EntityResponseType> {
    return this.http.put<IMoodPicker>(`${this.resourceUrl}/${this.getMoodPickerIdentifier(moodPicker)}`, moodPicker, {
      observe: 'response',
    });
  }

  partialUpdate(moodPicker: PartialUpdateMoodPicker): Observable<EntityResponseType> {
    return this.http.patch<IMoodPicker>(`${this.resourceUrl}/${this.getMoodPickerIdentifier(moodPicker)}`, moodPicker, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMoodPicker>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMoodPicker[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMoodPickerIdentifier(moodPicker: Pick<IMoodPicker, 'id'>): number {
    return moodPicker.id;
  }

  compareMoodPicker(o1: Pick<IMoodPicker, 'id'> | null, o2: Pick<IMoodPicker, 'id'> | null): boolean {
    return o1 && o2 ? this.getMoodPickerIdentifier(o1) === this.getMoodPickerIdentifier(o2) : o1 === o2;
  }

  addMoodPickerToCollectionIfMissing<Type extends Pick<IMoodPicker, 'id'>>(
    moodPickerCollection: Type[],
    ...moodPickersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const moodPickers: Type[] = moodPickersToCheck.filter(isPresent);
    if (moodPickers.length > 0) {
      const moodPickerCollectionIdentifiers = moodPickerCollection.map(moodPickerItem => this.getMoodPickerIdentifier(moodPickerItem)!);
      const moodPickersToAdd = moodPickers.filter(moodPickerItem => {
        const moodPickerIdentifier = this.getMoodPickerIdentifier(moodPickerItem);
        if (moodPickerCollectionIdentifiers.includes(moodPickerIdentifier)) {
          return false;
        }
        moodPickerCollectionIdentifiers.push(moodPickerIdentifier);
        return true;
      });
      return [...moodPickersToAdd, ...moodPickerCollection];
    }
    return moodPickerCollection;
  }
}
