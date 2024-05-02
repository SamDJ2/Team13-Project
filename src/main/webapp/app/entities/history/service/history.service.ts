import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHistory, NewHistory } from '../history.model';
import { AccountService } from '../../../core/auth/account.service';

export type PartialUpdateHistory = Partial<IHistory> & Pick<IHistory, 'id'>;

type RestOf<T extends IHistory | NewHistory> = Omit<T, 'dateStarted'> & {
  dateStarted?: string | null;
};

export type RestHistory = RestOf<IHistory>;

export type NewRestHistory = RestOf<NewHistory>;

export type PartialUpdateRestHistory = RestOf<PartialUpdateHistory>;

export type EntityResponseType = HttpResponse<IHistory>;
export type EntityArrayResponseType = HttpResponse<IHistory[]>;

@Injectable({ providedIn: 'root' })
export class HistoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/histories');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private accountService: AccountService
  ) {}

  create(history: NewHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .post<RestHistory>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(history: IHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .put<RestHistory>(`${this.resourceUrl}/${this.getHistoryIdentifier(history)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(history: PartialUpdateHistory): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(history);
    return this.http
      .patch<RestHistory>(`${this.resourceUrl}/${this.getHistoryIdentifier(history)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestHistory>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestHistory[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHistoryIdentifier(history: Pick<IHistory, 'id'>): number {
    return history.id;
  }

  compareHistory(o1: Pick<IHistory, 'id'> | null, o2: Pick<IHistory, 'id'> | null): boolean {
    return o1 && o2 ? this.getHistoryIdentifier(o1) === this.getHistoryIdentifier(o2) : o1 === o2;
  }

  addHistoryToCollectionIfMissing<Type extends Pick<IHistory, 'id'>>(
    historyCollection: Type[],
    ...historiesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const histories: Type[] = historiesToCheck.filter(isPresent);
    if (histories.length > 0) {
      const historyCollectionIdentifiers = historyCollection.map(historyItem => this.getHistoryIdentifier(historyItem)!);
      const historiesToAdd = histories.filter(historyItem => {
        const historyIdentifier = this.getHistoryIdentifier(historyItem);
        if (historyCollectionIdentifiers.includes(historyIdentifier)) {
          return false;
        }
        historyCollectionIdentifiers.push(historyIdentifier);
        return true;
      });
      return [...historiesToAdd, ...historyCollection];
    }
    return historyCollection;
  }

  protected convertDateFromClient<T extends IHistory | NewHistory | PartialUpdateHistory>(history: T): RestOf<T> {
    return {
      ...history,
      dateStarted: history.dateStarted?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restHistory: RestHistory): IHistory {
    return {
      ...restHistory,
      dateStarted: restHistory.dateStarted ? dayjs(restHistory.dateStarted) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestHistory>): HttpResponse<IHistory> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestHistory[]>): HttpResponse<IHistory[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  // my code
  createH(history: NewHistory): Observable<HttpResponse<IHistory>> {
    const copy = this.convertDateFromClient(history);
    return this.http.post<IHistory>(this.resourceUrl, copy, { observe: 'response' });
  }

  createHistoryForChallenge(challengeName: string, challengeLevel: string, startDate: dayjs.Dayjs): Observable<HttpResponse<IHistory>> {
    return this.accountService.identity().pipe(
      switchMap(account => {
        if (account !== null) {
          const username = account.login;
          const history: NewHistory = {
            id: null,
            username,
            challengeName,
            challengeLevel,
            dateStarted: startDate,
          };
          return this.createH(history);
        } else {
          return throwError('User is not logged in.');
        }
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  private historyUrl = 'api/histories';
  getHistoriesByUser(userId: String): Observable<HttpResponse<IHistory[]>> {
    return this.http.get<IHistory[]>(`${this.historyUrl}?userId=${userId}`, { observe: 'response' });
  }
}
