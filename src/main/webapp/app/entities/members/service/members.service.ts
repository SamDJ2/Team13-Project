import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMembers, NewMembers } from '../members.model';

export type PartialUpdateMembers = Partial<IMembers> & Pick<IMembers, 'id'>;

export type EntityResponseType = HttpResponse<IMembers>;
export type EntityArrayResponseType = HttpResponse<IMembers[]>;

@Injectable({ providedIn: 'root' })
export class MembersService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/members');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(members: NewMembers): Observable<EntityResponseType> {
    return this.http.post<IMembers>(this.resourceUrl, members, { observe: 'response' });
  }

  update(members: IMembers): Observable<EntityResponseType> {
    return this.http.put<IMembers>(`${this.resourceUrl}/${this.getMembersIdentifier(members)}`, members, { observe: 'response' });
  }

  partialUpdate(members: PartialUpdateMembers): Observable<EntityResponseType> {
    return this.http.patch<IMembers>(`${this.resourceUrl}/${this.getMembersIdentifier(members)}`, members, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMembers>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMembers[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMembersIdentifier(members: Pick<IMembers, 'id'>): number {
    return members.id;
  }

  compareMembers(o1: Pick<IMembers, 'id'> | null, o2: Pick<IMembers, 'id'> | null): boolean {
    return o1 && o2 ? this.getMembersIdentifier(o1) === this.getMembersIdentifier(o2) : o1 === o2;
  }

  addMembersToCollectionIfMissing<Type extends Pick<IMembers, 'id'>>(
    membersCollection: Type[],
    ...membersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const members: Type[] = membersToCheck.filter(isPresent);
    if (members.length > 0) {
      const membersCollectionIdentifiers = membersCollection.map(membersItem => this.getMembersIdentifier(membersItem)!);
      const membersToAdd = members.filter(membersItem => {
        const membersIdentifier = this.getMembersIdentifier(membersItem);
        if (membersCollectionIdentifiers.includes(membersIdentifier)) {
          return false;
        }
        membersCollectionIdentifiers.push(membersIdentifier);
        return true;
      });
      return [...membersToAdd, ...membersCollection];
    }
    return membersCollection;
  }
}
