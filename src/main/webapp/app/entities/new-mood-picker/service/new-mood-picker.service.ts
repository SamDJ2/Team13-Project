import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INewMoodPicker, NewNewMoodPicker } from '../new-mood-picker.model';

export type PartialUpdateNewMoodPicker = Partial<INewMoodPicker> & Pick<INewMoodPicker, 'id'>;

export type EntityResponseType = HttpResponse<INewMoodPicker>;
export type EntityArrayResponseType = HttpResponse<INewMoodPicker[]>;

@Injectable({ providedIn: 'root' })
export class NewMoodPickerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/new-mood-pickers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(newMoodPicker: NewNewMoodPicker): Observable<EntityResponseType> {
    return this.http.post<INewMoodPicker>(this.resourceUrl, newMoodPicker, { observe: 'response' });
  }

  update(newMoodPicker: INewMoodPicker): Observable<EntityResponseType> {
    return this.http.put<INewMoodPicker>(`${this.resourceUrl}/${this.getNewMoodPickerIdentifier(newMoodPicker)}`, newMoodPicker, {
      observe: 'response',
    });
  }

  partialUpdate(newMoodPicker: PartialUpdateNewMoodPicker): Observable<EntityResponseType> {
    return this.http.patch<INewMoodPicker>(`${this.resourceUrl}/${this.getNewMoodPickerIdentifier(newMoodPicker)}`, newMoodPicker, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INewMoodPicker>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INewMoodPicker[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNewMoodPickerIdentifier(newMoodPicker: Pick<INewMoodPicker, 'id'>): number {
    return newMoodPicker.id;
  }

  compareNewMoodPicker(o1: Pick<INewMoodPicker, 'id'> | null, o2: Pick<INewMoodPicker, 'id'> | null): boolean {
    return o1 && o2 ? this.getNewMoodPickerIdentifier(o1) === this.getNewMoodPickerIdentifier(o2) : o1 === o2;
  }

  addNewMoodPickerToCollectionIfMissing<Type extends Pick<INewMoodPicker, 'id'>>(
    newMoodPickerCollection: Type[],
    ...newMoodPickersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const newMoodPickers: Type[] = newMoodPickersToCheck.filter(isPresent);
    if (newMoodPickers.length > 0) {
      const newMoodPickerCollectionIdentifiers = newMoodPickerCollection.map(
        newMoodPickerItem => this.getNewMoodPickerIdentifier(newMoodPickerItem)!
      );
      const newMoodPickersToAdd = newMoodPickers.filter(newMoodPickerItem => {
        const newMoodPickerIdentifier = this.getNewMoodPickerIdentifier(newMoodPickerItem);
        if (newMoodPickerCollectionIdentifiers.includes(newMoodPickerIdentifier)) {
          return false;
        }
        newMoodPickerCollectionIdentifiers.push(newMoodPickerIdentifier);
        return true;
      });
      return [...newMoodPickersToAdd, ...newMoodPickerCollection];
    }
    return newMoodPickerCollection;
  }
}
