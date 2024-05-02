import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISmoking, NewSmoking } from '../smoking.model';

export type PartialUpdateSmoking = Partial<ISmoking> & Pick<ISmoking, 'id'>;

export type EntityResponseType = HttpResponse<ISmoking>;
export type EntityArrayResponseType = HttpResponse<ISmoking[]>;

@Injectable({ providedIn: 'root' })
export class SmokingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/smokings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(smoking: NewSmoking): Observable<EntityResponseType> {
    return this.http.post<ISmoking>(this.resourceUrl, smoking, { observe: 'response' });
  }

  update(smoking: ISmoking): Observable<EntityResponseType> {
    return this.http.put<ISmoking>(`${this.resourceUrl}/${this.getSmokingIdentifier(smoking)}`, smoking, { observe: 'response' });
  }

  partialUpdate(smoking: PartialUpdateSmoking): Observable<EntityResponseType> {
    return this.http.patch<ISmoking>(`${this.resourceUrl}/${this.getSmokingIdentifier(smoking)}`, smoking, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISmoking>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISmoking[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSmokingIdentifier(smoking: Pick<ISmoking, 'id'>): number {
    return smoking.id;
  }

  compareSmoking(o1: Pick<ISmoking, 'id'> | null, o2: Pick<ISmoking, 'id'> | null): boolean {
    return o1 && o2 ? this.getSmokingIdentifier(o1) === this.getSmokingIdentifier(o2) : o1 === o2;
  }

  addSmokingToCollectionIfMissing<Type extends Pick<ISmoking, 'id'>>(
    smokingCollection: Type[],
    ...smokingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const smokings: Type[] = smokingsToCheck.filter(isPresent);
    if (smokings.length > 0) {
      const smokingCollectionIdentifiers = smokingCollection.map(smokingItem => this.getSmokingIdentifier(smokingItem)!);
      const smokingsToAdd = smokings.filter(smokingItem => {
        const smokingIdentifier = this.getSmokingIdentifier(smokingItem);
        if (smokingCollectionIdentifiers.includes(smokingIdentifier)) {
          return false;
        }
        smokingCollectionIdentifiers.push(smokingIdentifier);
        return true;
      });
      return [...smokingsToAdd, ...smokingCollection];
    }
    return smokingCollection;
  }
}
