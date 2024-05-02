import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INewWeeklyHabitTracker, NewNewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';

export type PartialUpdateNewWeeklyHabitTracker = Partial<INewWeeklyHabitTracker> & Pick<INewWeeklyHabitTracker, 'id'>;

type RestOf<T extends INewWeeklyHabitTracker | NewNewWeeklyHabitTracker> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestNewWeeklyHabitTracker = RestOf<INewWeeklyHabitTracker>;

export type NewRestNewWeeklyHabitTracker = RestOf<NewNewWeeklyHabitTracker>;

export type PartialUpdateRestNewWeeklyHabitTracker = RestOf<PartialUpdateNewWeeklyHabitTracker>;

export type EntityResponseType = HttpResponse<INewWeeklyHabitTracker>;
export type EntityArrayResponseType = HttpResponse<INewWeeklyHabitTracker[]>;

@Injectable({ providedIn: 'root' })
export class NewWeeklyHabitTrackerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/new-weekly-habit-trackers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(newWeeklyHabitTracker: NewNewWeeklyHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newWeeklyHabitTracker);
    return this.http
      .post<RestNewWeeklyHabitTracker>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(newWeeklyHabitTracker: INewWeeklyHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newWeeklyHabitTracker);
    return this.http
      .put<RestNewWeeklyHabitTracker>(`${this.resourceUrl}/${this.getNewWeeklyHabitTrackerIdentifier(newWeeklyHabitTracker)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(newWeeklyHabitTracker: PartialUpdateNewWeeklyHabitTracker): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(newWeeklyHabitTracker);
    return this.http
      .patch<RestNewWeeklyHabitTracker>(`${this.resourceUrl}/${this.getNewWeeklyHabitTrackerIdentifier(newWeeklyHabitTracker)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestNewWeeklyHabitTracker>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestNewWeeklyHabitTracker[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNewWeeklyHabitTrackerIdentifier(newWeeklyHabitTracker: Pick<INewWeeklyHabitTracker, 'id'>): number {
    return newWeeklyHabitTracker.id;
  }

  compareNewWeeklyHabitTracker(o1: Pick<INewWeeklyHabitTracker, 'id'> | null, o2: Pick<INewWeeklyHabitTracker, 'id'> | null): boolean {
    return o1 && o2 ? this.getNewWeeklyHabitTrackerIdentifier(o1) === this.getNewWeeklyHabitTrackerIdentifier(o2) : o1 === o2;
  }

  addNewWeeklyHabitTrackerToCollectionIfMissing<Type extends Pick<INewWeeklyHabitTracker, 'id'>>(
    newWeeklyHabitTrackerCollection: Type[],
    ...newWeeklyHabitTrackersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const newWeeklyHabitTrackers: Type[] = newWeeklyHabitTrackersToCheck.filter(isPresent);
    if (newWeeklyHabitTrackers.length > 0) {
      const newWeeklyHabitTrackerCollectionIdentifiers = newWeeklyHabitTrackerCollection.map(
        newWeeklyHabitTrackerItem => this.getNewWeeklyHabitTrackerIdentifier(newWeeklyHabitTrackerItem)!
      );
      const newWeeklyHabitTrackersToAdd = newWeeklyHabitTrackers.filter(newWeeklyHabitTrackerItem => {
        const newWeeklyHabitTrackerIdentifier = this.getNewWeeklyHabitTrackerIdentifier(newWeeklyHabitTrackerItem);
        if (newWeeklyHabitTrackerCollectionIdentifiers.includes(newWeeklyHabitTrackerIdentifier)) {
          return false;
        }
        newWeeklyHabitTrackerCollectionIdentifiers.push(newWeeklyHabitTrackerIdentifier);
        return true;
      });
      return [...newWeeklyHabitTrackersToAdd, ...newWeeklyHabitTrackerCollection];
    }
    return newWeeklyHabitTrackerCollection;
  }

  protected convertDateFromClient<T extends INewWeeklyHabitTracker | NewNewWeeklyHabitTracker | PartialUpdateNewWeeklyHabitTracker>(
    newWeeklyHabitTracker: T
  ): RestOf<T> {
    return {
      ...newWeeklyHabitTracker,
      date: newWeeklyHabitTracker.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restNewWeeklyHabitTracker: RestNewWeeklyHabitTracker): INewWeeklyHabitTracker {
    return {
      ...restNewWeeklyHabitTracker,
      date: restNewWeeklyHabitTracker.date ? dayjs(restNewWeeklyHabitTracker.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestNewWeeklyHabitTracker>): HttpResponse<INewWeeklyHabitTracker> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestNewWeeklyHabitTracker[]>): HttpResponse<INewWeeklyHabitTracker[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
