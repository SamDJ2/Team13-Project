import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILeaderBoards, NewLeaderBoards } from '../leader-boards.model';

export type PartialUpdateLeaderBoards = Partial<ILeaderBoards> & Pick<ILeaderBoards, 'id'>;

export type EntityResponseType = HttpResponse<ILeaderBoards>;
export type EntityArrayResponseType = HttpResponse<ILeaderBoards[]>;

@Injectable({ providedIn: 'root' })
export class LeaderBoardsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/leader-boards');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(leaderBoards: NewLeaderBoards): Observable<EntityResponseType> {
    return this.http.post<ILeaderBoards>(this.resourceUrl, leaderBoards, { observe: 'response' });
  }

  update(leaderBoards: ILeaderBoards): Observable<EntityResponseType> {
    return this.http.put<ILeaderBoards>(`${this.resourceUrl}/${this.getLeaderBoardsIdentifier(leaderBoards)}`, leaderBoards, {
      observe: 'response',
    });
  }

  partialUpdate(leaderBoards: PartialUpdateLeaderBoards): Observable<EntityResponseType> {
    return this.http.patch<ILeaderBoards>(`${this.resourceUrl}/${this.getLeaderBoardsIdentifier(leaderBoards)}`, leaderBoards, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILeaderBoards>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILeaderBoards[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLeaderBoardsIdentifier(leaderBoards: Pick<ILeaderBoards, 'id'>): number {
    return leaderBoards.id;
  }

  compareLeaderBoards(o1: Pick<ILeaderBoards, 'id'> | null, o2: Pick<ILeaderBoards, 'id'> | null): boolean {
    return o1 && o2 ? this.getLeaderBoardsIdentifier(o1) === this.getLeaderBoardsIdentifier(o2) : o1 === o2;
  }

  addLeaderBoardsToCollectionIfMissing<Type extends Pick<ILeaderBoards, 'id'>>(
    leaderBoardsCollection: Type[],
    ...leaderBoardsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const leaderBoards: Type[] = leaderBoardsToCheck.filter(isPresent);
    if (leaderBoards.length > 0) {
      const leaderBoardsCollectionIdentifiers = leaderBoardsCollection.map(
        leaderBoardsItem => this.getLeaderBoardsIdentifier(leaderBoardsItem)!
      );
      const leaderBoardsToAdd = leaderBoards.filter(leaderBoardsItem => {
        const leaderBoardsIdentifier = this.getLeaderBoardsIdentifier(leaderBoardsItem);
        if (leaderBoardsCollectionIdentifiers.includes(leaderBoardsIdentifier)) {
          return false;
        }
        leaderBoardsCollectionIdentifiers.push(leaderBoardsIdentifier);
        return true;
      });
      return [...leaderBoardsToAdd, ...leaderBoardsCollection];
    }
    return leaderBoardsCollection;
  }
}
