import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFiltered, NewFiltered } from '../filtered.model';

export type PartialUpdateFiltered = Partial<IFiltered> & Pick<IFiltered, 'id'>;

export type EntityResponseType = HttpResponse<IFiltered>;
export type EntityArrayResponseType = HttpResponse<IFiltered[]>;

@Injectable({ providedIn: 'root' })
export class FilteredService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/filtereds');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(filtered: NewFiltered): Observable<EntityResponseType> {
    return this.http.post<IFiltered>(this.resourceUrl, filtered, { observe: 'response' });
  }

  update(filtered: IFiltered): Observable<EntityResponseType> {
    return this.http.put<IFiltered>(`${this.resourceUrl}/${this.getFilteredIdentifier(filtered)}`, filtered, { observe: 'response' });
  }

  partialUpdate(filtered: PartialUpdateFiltered): Observable<EntityResponseType> {
    return this.http.patch<IFiltered>(`${this.resourceUrl}/${this.getFilteredIdentifier(filtered)}`, filtered, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFiltered>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFiltered[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFilteredIdentifier(filtered: Pick<IFiltered, 'id'>): number {
    return filtered.id;
  }

  compareFiltered(o1: Pick<IFiltered, 'id'> | null, o2: Pick<IFiltered, 'id'> | null): boolean {
    return o1 && o2 ? this.getFilteredIdentifier(o1) === this.getFilteredIdentifier(o2) : o1 === o2;
  }

  addFilteredToCollectionIfMissing<Type extends Pick<IFiltered, 'id'>>(
    filteredCollection: Type[],
    ...filteredsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const filtereds: Type[] = filteredsToCheck.filter(isPresent);
    if (filtereds.length > 0) {
      const filteredCollectionIdentifiers = filteredCollection.map(filteredItem => this.getFilteredIdentifier(filteredItem)!);
      const filteredsToAdd = filtereds.filter(filteredItem => {
        const filteredIdentifier = this.getFilteredIdentifier(filteredItem);
        if (filteredCollectionIdentifiers.includes(filteredIdentifier)) {
          return false;
        }
        filteredCollectionIdentifiers.push(filteredIdentifier);
        return true;
      });
      return [...filteredsToAdd, ...filteredCollection];
    }
    return filteredCollection;
  }
}
