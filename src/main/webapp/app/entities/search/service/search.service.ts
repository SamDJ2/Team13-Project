import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISearch, NewSearch } from '../search.model';

export type PartialUpdateSearch = Partial<ISearch> & Pick<ISearch, 'id'>;

export type EntityResponseType = HttpResponse<ISearch>;
export type EntityArrayResponseType = HttpResponse<ISearch[]>;

@Injectable({ providedIn: 'root' })
export class SearchService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/searches');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(search: NewSearch): Observable<EntityResponseType> {
    return this.http.post<ISearch>(this.resourceUrl, search, { observe: 'response' });
  }

  update(search: ISearch): Observable<EntityResponseType> {
    return this.http.put<ISearch>(`${this.resourceUrl}/${this.getSearchIdentifier(search)}`, search, { observe: 'response' });
  }

  partialUpdate(search: PartialUpdateSearch): Observable<EntityResponseType> {
    return this.http.patch<ISearch>(`${this.resourceUrl}/${this.getSearchIdentifier(search)}`, search, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISearch>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISearch[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSearchIdentifier(search: Pick<ISearch, 'id'>): number {
    return search.id;
  }

  compareSearch(o1: Pick<ISearch, 'id'> | null, o2: Pick<ISearch, 'id'> | null): boolean {
    return o1 && o2 ? this.getSearchIdentifier(o1) === this.getSearchIdentifier(o2) : o1 === o2;
  }

  addSearchToCollectionIfMissing<Type extends Pick<ISearch, 'id'>>(
    searchCollection: Type[],
    ...searchesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const searches: Type[] = searchesToCheck.filter(isPresent);
    if (searches.length > 0) {
      const searchCollectionIdentifiers = searchCollection.map(searchItem => this.getSearchIdentifier(searchItem)!);
      const searchesToAdd = searches.filter(searchItem => {
        const searchIdentifier = this.getSearchIdentifier(searchItem);
        if (searchCollectionIdentifiers.includes(searchIdentifier)) {
          return false;
        }
        searchCollectionIdentifiers.push(searchIdentifier);
        return true;
      });
      return [...searchesToAdd, ...searchCollection];
    }
    return searchCollection;
  }
}
