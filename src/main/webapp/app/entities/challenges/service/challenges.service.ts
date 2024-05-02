import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IChallenges, NewChallenges } from '../challenges.model';

export type PartialUpdateChallenges = Partial<IChallenges> & Pick<IChallenges, 'id'>;

export type EntityResponseType = HttpResponse<IChallenges>;
export type EntityArrayResponseType = HttpResponse<IChallenges[]>;

@Injectable({ providedIn: 'root' })
export class ChallengesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/challenges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(challenges: NewChallenges): Observable<EntityResponseType> {
    return this.http.post<IChallenges>(this.resourceUrl, challenges, { observe: 'response' });
  }

  update(challenges: IChallenges): Observable<EntityResponseType> {
    return this.http.put<IChallenges>(`${this.resourceUrl}/${this.getChallengesIdentifier(challenges)}`, challenges, {
      observe: 'response',
    });
  }

  partialUpdate(challenges: PartialUpdateChallenges): Observable<EntityResponseType> {
    return this.http.patch<IChallenges>(`${this.resourceUrl}/${this.getChallengesIdentifier(challenges)}`, challenges, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IChallenges>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IChallenges[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getChallengesIdentifier(challenges: Pick<IChallenges, 'id'>): number {
    return challenges.id;
  }

  compareChallenges(o1: Pick<IChallenges, 'id'> | null, o2: Pick<IChallenges, 'id'> | null): boolean {
    return o1 && o2 ? this.getChallengesIdentifier(o1) === this.getChallengesIdentifier(o2) : o1 === o2;
  }

  addChallengesToCollectionIfMissing<Type extends Pick<IChallenges, 'id'>>(
    challengesCollection: Type[],
    ...challengesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const challenges: Type[] = challengesToCheck.filter(isPresent);
    if (challenges.length > 0) {
      const challengesCollectionIdentifiers = challengesCollection.map(challengesItem => this.getChallengesIdentifier(challengesItem)!);
      const challengesToAdd = challenges.filter(challengesItem => {
        const challengesIdentifier = this.getChallengesIdentifier(challengesItem);
        if (challengesCollectionIdentifiers.includes(challengesIdentifier)) {
          return false;
        }
        challengesCollectionIdentifiers.push(challengesIdentifier);
        return true;
      });
      return [...challengesToAdd, ...challengesCollection];
    }
    return challengesCollection;
  }
}
