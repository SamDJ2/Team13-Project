import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUserPoints, NewUserPoints } from '../user-points.model';

export type PartialUpdateUserPoints = Partial<IUserPoints> & Pick<IUserPoints, 'id'>;

export type EntityResponseType = HttpResponse<IUserPoints>;
export type EntityArrayResponseType = HttpResponse<IUserPoints[]>;

@Injectable({ providedIn: 'root' })
export class UserPointsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/user-points');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(userPoints: NewUserPoints): Observable<EntityResponseType> {
    return this.http.post<IUserPoints>(this.resourceUrl, userPoints, { observe: 'response' });
  }

  update(userPoints: IUserPoints): Observable<EntityResponseType> {
    return this.http.put<IUserPoints>(`${this.resourceUrl}/${this.getUserPointsIdentifier(userPoints)}`, userPoints, {
      observe: 'response',
    });
  }

  partialUpdate(userPoints: PartialUpdateUserPoints): Observable<EntityResponseType> {
    return this.http.patch<IUserPoints>(`${this.resourceUrl}/${this.getUserPointsIdentifier(userPoints)}`, userPoints, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IUserPoints>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IUserPoints[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getUserPointsIdentifier(userPoints: Pick<IUserPoints, 'id'>): number {
    return userPoints.id;
  }

  compareUserPoints(o1: Pick<IUserPoints, 'id'> | null, o2: Pick<IUserPoints, 'id'> | null): boolean {
    return o1 && o2 ? this.getUserPointsIdentifier(o1) === this.getUserPointsIdentifier(o2) : o1 === o2;
  }

  addUserPointsToCollectionIfMissing<Type extends Pick<IUserPoints, 'id'>>(
    userPointsCollection: Type[],
    ...userPointsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const userPoints: Type[] = userPointsToCheck.filter(isPresent);
    if (userPoints.length > 0) {
      const userPointsCollectionIdentifiers = userPointsCollection.map(userPointsItem => this.getUserPointsIdentifier(userPointsItem)!);
      const userPointsToAdd = userPoints.filter(userPointsItem => {
        const userPointsIdentifier = this.getUserPointsIdentifier(userPointsItem);
        if (userPointsCollectionIdentifiers.includes(userPointsIdentifier)) {
          return false;
        }
        userPointsCollectionIdentifiers.push(userPointsIdentifier);
        return true;
      });
      return [...userPointsToAdd, ...userPointsCollection];
    }
    return userPointsCollection;
  }
}
