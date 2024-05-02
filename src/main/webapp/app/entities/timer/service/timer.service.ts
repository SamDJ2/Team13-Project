import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITimer, NewTimer } from '../timer.model';

export type PartialUpdateTimer = Partial<ITimer> & Pick<ITimer, 'id'>;

type RestOf<T extends ITimer | NewTimer> = Omit<T, 'startTime'> & {
  startTime?: string | null;
};

export type RestTimer = RestOf<ITimer>;

export type NewRestTimer = RestOf<NewTimer>;

export type PartialUpdateRestTimer = RestOf<PartialUpdateTimer>;

export type EntityResponseType = HttpResponse<ITimer>;
export type EntityArrayResponseType = HttpResponse<ITimer[]>;

@Injectable({ providedIn: 'root' })
export class TimerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/timers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(timer: NewTimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timer);
    return this.http.post<RestTimer>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(timer: ITimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timer);
    return this.http
      .put<RestTimer>(`${this.resourceUrl}/${this.getTimerIdentifier(timer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(timer: PartialUpdateTimer): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(timer);
    return this.http
      .patch<RestTimer>(`${this.resourceUrl}/${this.getTimerIdentifier(timer)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestTimer>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestTimer[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getTimerIdentifier(timer: Pick<ITimer, 'id'>): number {
    return timer.id;
  }

  compareTimer(o1: Pick<ITimer, 'id'> | null, o2: Pick<ITimer, 'id'> | null): boolean {
    return o1 && o2 ? this.getTimerIdentifier(o1) === this.getTimerIdentifier(o2) : o1 === o2;
  }

  addTimerToCollectionIfMissing<Type extends Pick<ITimer, 'id'>>(
    timerCollection: Type[],
    ...timersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const timers: Type[] = timersToCheck.filter(isPresent);
    if (timers.length > 0) {
      const timerCollectionIdentifiers = timerCollection.map(timerItem => this.getTimerIdentifier(timerItem)!);
      const timersToAdd = timers.filter(timerItem => {
        const timerIdentifier = this.getTimerIdentifier(timerItem);
        if (timerCollectionIdentifiers.includes(timerIdentifier)) {
          return false;
        }
        timerCollectionIdentifiers.push(timerIdentifier);
        return true;
      });
      return [...timersToAdd, ...timerCollection];
    }
    return timerCollection;
  }

  protected convertDateFromClient<T extends ITimer | NewTimer | PartialUpdateTimer>(timer: T): RestOf<T> {
    return {
      ...timer,
      startTime: timer.startTime?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restTimer: RestTimer): ITimer {
    return {
      ...restTimer,
      startTime: restTimer.startTime ? dayjs(restTimer.startTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestTimer>): HttpResponse<ITimer> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestTimer[]>): HttpResponse<ITimer[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
