import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, switchMap, throwError } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPoints, NewPoints } from '../points.model';
import { AccountService } from '../../../core/auth/account.service';
import { catchError } from 'rxjs/operators';

export type PartialUpdatePoints = Partial<IPoints> & Pick<IPoints, 'id'>;

export type EntityResponseType = HttpResponse<IPoints>;
export type EntityArrayResponseType = HttpResponse<IPoints[]>;

@Injectable({ providedIn: 'root' })
export class PointsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/points');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    private accountService: AccountService
  ) {}

  create(points: NewPoints): Observable<EntityResponseType> {
    return this.http.post<IPoints>(this.resourceUrl, points, { observe: 'response' });
  }

  update(points: IPoints): Observable<EntityResponseType> {
    return this.http.put<IPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, points, { observe: 'response' });
  }

  partialUpdate(points: PartialUpdatePoints): Observable<EntityResponseType> {
    return this.http.patch<IPoints>(`${this.resourceUrl}/${this.getPointsIdentifier(points)}`, points, { observe: 'response' });
  }

  deductPoints(pointsToDeduct: number): Observable<any> {
    return this.accountService.identity().pipe(
      switchMap(account => {
        if (account && account.login) {
          const username = account.login;
          // Assuming you have a method to construct the request
          return this.http.post(`${this.resourceUrl}/deduct`, null, {
            params: new HttpParams().set('username', username).set('points', pointsToDeduct.toString()),
            observe: 'response',
          });
        } else {
          return throwError(() => new Error('User is not logged in.'));
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  addPoints(pointsToAdd: number): Observable<any> {
    return this.accountService.identity().pipe(
      switchMap(account => {
        if (account && account.login) {
          const username = account.login;
          // Assuming you have a method to construct the request
          return this.http.post(`${this.resourceUrl}/add`, null, {
            params: new HttpParams().set('username', username).set('points', pointsToAdd.toString()),
            observe: 'response',
          });
        } else {
          return throwError(() => new Error('User is not logged in.'));
        }
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPoints[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPointsIdentifier(points: Pick<IPoints, 'id'>): number {
    return points.id;
  }

  comparePoints(o1: Pick<IPoints, 'id'> | null, o2: Pick<IPoints, 'id'> | null): boolean {
    return o1 && o2 ? this.getPointsIdentifier(o1) === this.getPointsIdentifier(o2) : o1 === o2;
  }

  addPointsToCollectionIfMissing<Type extends Pick<IPoints, 'id'>>(
    pointsCollection: Type[],
    ...pointsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const points: Type[] = pointsToCheck.filter(isPresent);
    if (points.length > 0) {
      const pointsCollectionIdentifiers = pointsCollection.map(pointsItem => this.getPointsIdentifier(pointsItem)!);
      const pointsToAdd = points.filter(pointsItem => {
        const pointsIdentifier = this.getPointsIdentifier(pointsItem);
        if (pointsCollectionIdentifiers.includes(pointsIdentifier)) {
          return false;
        }
        pointsCollectionIdentifiers.push(pointsIdentifier);
        return true;
      });
      return [...pointsToAdd, ...pointsCollection];
    }
    return pointsCollection;
  }
}
