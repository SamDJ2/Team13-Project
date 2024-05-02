import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IBadges, NewBadges } from '../badges.model';

export type PartialUpdateBadges = Partial<IBadges> & Pick<IBadges, 'id'>;

export type EntityResponseType = HttpResponse<IBadges>;
export type EntityArrayResponseType = HttpResponse<IBadges[]>;

@Injectable({ providedIn: 'root' })
export class BadgesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/badges');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(badges: NewBadges): Observable<EntityResponseType> {
    return this.http.post<IBadges>(this.resourceUrl, badges, { observe: 'response' });
  }

  update(badges: IBadges): Observable<EntityResponseType> {
    return this.http.put<IBadges>(`${this.resourceUrl}/${this.getBadgesIdentifier(badges)}`, badges, { observe: 'response' });
  }

  partialUpdate(badges: PartialUpdateBadges): Observable<EntityResponseType> {
    return this.http.patch<IBadges>(`${this.resourceUrl}/${this.getBadgesIdentifier(badges)}`, badges, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IBadges>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IBadges[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBadgesIdentifier(badges: Pick<IBadges, 'id'>): number {
    return badges.id;
  }

  compareBadges(o1: Pick<IBadges, 'id'> | null, o2: Pick<IBadges, 'id'> | null): boolean {
    return o1 && o2 ? this.getBadgesIdentifier(o1) === this.getBadgesIdentifier(o2) : o1 === o2;
  }

  addBadgesToCollectionIfMissing<Type extends Pick<IBadges, 'id'>>(
    badgesCollection: Type[],
    ...badgesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const badges: Type[] = badgesToCheck.filter(isPresent);
    if (badges.length > 0) {
      const badgesCollectionIdentifiers = badgesCollection.map(badgesItem => this.getBadgesIdentifier(badgesItem)!);
      const badgesToAdd = badges.filter(badgesItem => {
        const badgesIdentifier = this.getBadgesIdentifier(badgesItem);
        if (badgesCollectionIdentifiers.includes(badgesIdentifier)) {
          return false;
        }
        badgesCollectionIdentifiers.push(badgesIdentifier);
        return true;
      });
      return [...badgesToAdd, ...badgesCollection];
    }
    return badgesCollection;
  }
}
