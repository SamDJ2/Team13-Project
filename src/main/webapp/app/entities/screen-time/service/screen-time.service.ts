import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScreenTime, NewScreenTime } from '../screen-time.model';

export type PartialUpdateScreenTime = Partial<IScreenTime> & Pick<IScreenTime, 'id'>;

export type EntityResponseType = HttpResponse<IScreenTime>;
export type EntityArrayResponseType = HttpResponse<IScreenTime[]>;

@Injectable({ providedIn: 'root' })
export class ScreenTimeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/screen-times');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(screenTime: NewScreenTime): Observable<EntityResponseType> {
    return this.http.post<IScreenTime>(this.resourceUrl, screenTime, { observe: 'response' });
  }

  update(screenTime: IScreenTime): Observable<EntityResponseType> {
    return this.http.put<IScreenTime>(`${this.resourceUrl}/${this.getScreenTimeIdentifier(screenTime)}`, screenTime, {
      observe: 'response',
    });
  }

  partialUpdate(screenTime: PartialUpdateScreenTime): Observable<EntityResponseType> {
    return this.http.patch<IScreenTime>(`${this.resourceUrl}/${this.getScreenTimeIdentifier(screenTime)}`, screenTime, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IScreenTime>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IScreenTime[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getScreenTimeIdentifier(screenTime: Pick<IScreenTime, 'id'>): number {
    return screenTime.id;
  }

  compareScreenTime(o1: Pick<IScreenTime, 'id'> | null, o2: Pick<IScreenTime, 'id'> | null): boolean {
    return o1 && o2 ? this.getScreenTimeIdentifier(o1) === this.getScreenTimeIdentifier(o2) : o1 === o2;
  }

  addScreenTimeToCollectionIfMissing<Type extends Pick<IScreenTime, 'id'>>(
    screenTimeCollection: Type[],
    ...screenTimesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const screenTimes: Type[] = screenTimesToCheck.filter(isPresent);
    if (screenTimes.length > 0) {
      const screenTimeCollectionIdentifiers = screenTimeCollection.map(screenTimeItem => this.getScreenTimeIdentifier(screenTimeItem)!);
      const screenTimesToAdd = screenTimes.filter(screenTimeItem => {
        const screenTimeIdentifier = this.getScreenTimeIdentifier(screenTimeItem);
        if (screenTimeCollectionIdentifiers.includes(screenTimeIdentifier)) {
          return false;
        }
        screenTimeCollectionIdentifiers.push(screenTimeIdentifier);
        return true;
      });
      return [...screenTimesToAdd, ...screenTimeCollection];
    }
    return screenTimeCollection;
  }
}
