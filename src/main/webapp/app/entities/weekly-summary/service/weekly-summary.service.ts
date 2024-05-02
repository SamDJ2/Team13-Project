import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWeeklySummary, NewWeeklySummary } from '../weekly-summary.model';

export type PartialUpdateWeeklySummary = Partial<IWeeklySummary> & Pick<IWeeklySummary, 'id'>;

export type EntityResponseType = HttpResponse<IWeeklySummary>;
export type EntityArrayResponseType = HttpResponse<IWeeklySummary[]>;

@Injectable({ providedIn: 'root' })
export class WeeklySummaryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/weekly-summaries');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(weeklySummary: NewWeeklySummary): Observable<EntityResponseType> {
    return this.http.post<IWeeklySummary>(this.resourceUrl, weeklySummary, { observe: 'response' });
  }

  update(weeklySummary: IWeeklySummary): Observable<EntityResponseType> {
    return this.http.put<IWeeklySummary>(`${this.resourceUrl}/${this.getWeeklySummaryIdentifier(weeklySummary)}`, weeklySummary, {
      observe: 'response',
    });
  }

  partialUpdate(weeklySummary: PartialUpdateWeeklySummary): Observable<EntityResponseType> {
    return this.http.patch<IWeeklySummary>(`${this.resourceUrl}/${this.getWeeklySummaryIdentifier(weeklySummary)}`, weeklySummary, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IWeeklySummary>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IWeeklySummary[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWeeklySummaryIdentifier(weeklySummary: Pick<IWeeklySummary, 'id'>): number {
    return weeklySummary.id;
  }

  compareWeeklySummary(o1: Pick<IWeeklySummary, 'id'> | null, o2: Pick<IWeeklySummary, 'id'> | null): boolean {
    return o1 && o2 ? this.getWeeklySummaryIdentifier(o1) === this.getWeeklySummaryIdentifier(o2) : o1 === o2;
  }

  addWeeklySummaryToCollectionIfMissing<Type extends Pick<IWeeklySummary, 'id'>>(
    weeklySummaryCollection: Type[],
    ...weeklySummariesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const weeklySummaries: Type[] = weeklySummariesToCheck.filter(isPresent);
    if (weeklySummaries.length > 0) {
      const weeklySummaryCollectionIdentifiers = weeklySummaryCollection.map(
        weeklySummaryItem => this.getWeeklySummaryIdentifier(weeklySummaryItem)!
      );
      const weeklySummariesToAdd = weeklySummaries.filter(weeklySummaryItem => {
        const weeklySummaryIdentifier = this.getWeeklySummaryIdentifier(weeklySummaryItem);
        if (weeklySummaryCollectionIdentifiers.includes(weeklySummaryIdentifier)) {
          return false;
        }
        weeklySummaryCollectionIdentifiers.push(weeklySummaryIdentifier);
        return true;
      });
      return [...weeklySummariesToAdd, ...weeklySummaryCollection];
    }
    return weeklySummaryCollection;
  }
}
