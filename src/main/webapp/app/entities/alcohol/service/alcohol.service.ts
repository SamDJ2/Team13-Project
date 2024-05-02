import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAlcohol, NewAlcohol } from '../alcohol.model';

export type PartialUpdateAlcohol = Partial<IAlcohol> & Pick<IAlcohol, 'id'>;

export type EntityResponseType = HttpResponse<IAlcohol>;
export type EntityArrayResponseType = HttpResponse<IAlcohol[]>;

@Injectable({ providedIn: 'root' })
export class AlcoholService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/alcohol');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(alcohol: NewAlcohol): Observable<EntityResponseType> {
    return this.http.post<IAlcohol>(this.resourceUrl, alcohol, { observe: 'response' });
  }

  update(alcohol: IAlcohol): Observable<EntityResponseType> {
    return this.http.put<IAlcohol>(`${this.resourceUrl}/${this.getAlcoholIdentifier(alcohol)}`, alcohol, { observe: 'response' });
  }

  partialUpdate(alcohol: PartialUpdateAlcohol): Observable<EntityResponseType> {
    return this.http.patch<IAlcohol>(`${this.resourceUrl}/${this.getAlcoholIdentifier(alcohol)}`, alcohol, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAlcohol>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAlcohol[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAlcoholIdentifier(alcohol: Pick<IAlcohol, 'id'>): number {
    return alcohol.id;
  }

  compareAlcohol(o1: Pick<IAlcohol, 'id'> | null, o2: Pick<IAlcohol, 'id'> | null): boolean {
    return o1 && o2 ? this.getAlcoholIdentifier(o1) === this.getAlcoholIdentifier(o2) : o1 === o2;
  }

  addAlcoholToCollectionIfMissing<Type extends Pick<IAlcohol, 'id'>>(
    alcoholCollection: Type[],
    ...alcoholToCheck: (Type | null | undefined)[]
  ): Type[] {
    const alcohol: Type[] = alcoholToCheck.filter(isPresent);
    if (alcohol.length > 0) {
      const alcoholCollectionIdentifiers = alcoholCollection.map(alcoholItem => this.getAlcoholIdentifier(alcoholItem)!);
      const alcoholToAdd = alcohol.filter(alcoholItem => {
        const alcoholIdentifier = this.getAlcoholIdentifier(alcoholItem);
        if (alcoholCollectionIdentifiers.includes(alcoholIdentifier)) {
          return false;
        }
        alcoholCollectionIdentifiers.push(alcoholIdentifier);
        return true;
      });
      return [...alcoholToAdd, ...alcoholCollection];
    }
    return alcoholCollection;
  }
}
