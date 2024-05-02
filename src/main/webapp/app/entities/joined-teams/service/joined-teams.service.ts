import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJoinedTeams, NewJoinedTeams } from '../joined-teams.model';

export type PartialUpdateJoinedTeams = Partial<IJoinedTeams> & Pick<IJoinedTeams, 'id'>;

type RestOf<T extends IJoinedTeams | NewJoinedTeams> = Omit<T, 'memberSince'> & {
  memberSince?: string | null;
};

export type RestJoinedTeams = RestOf<IJoinedTeams>;

export type NewRestJoinedTeams = RestOf<NewJoinedTeams>;

export type PartialUpdateRestJoinedTeams = RestOf<PartialUpdateJoinedTeams>;

export type EntityResponseType = HttpResponse<IJoinedTeams>;
export type EntityArrayResponseType = HttpResponse<IJoinedTeams[]>;

@Injectable({ providedIn: 'root' })
export class JoinedTeamsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/joined-teams');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(joinedTeams: NewJoinedTeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(joinedTeams);
    return this.http
      .post<RestJoinedTeams>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(joinedTeams: IJoinedTeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(joinedTeams);
    return this.http
      .put<RestJoinedTeams>(`${this.resourceUrl}/${this.getJoinedTeamsIdentifier(joinedTeams)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(joinedTeams: PartialUpdateJoinedTeams): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(joinedTeams);
    return this.http
      .patch<RestJoinedTeams>(`${this.resourceUrl}/${this.getJoinedTeamsIdentifier(joinedTeams)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestJoinedTeams>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestJoinedTeams[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJoinedTeamsIdentifier(joinedTeams: Pick<IJoinedTeams, 'id'>): number {
    return joinedTeams.id;
  }

  compareJoinedTeams(o1: Pick<IJoinedTeams, 'id'> | null, o2: Pick<IJoinedTeams, 'id'> | null): boolean {
    return o1 && o2 ? this.getJoinedTeamsIdentifier(o1) === this.getJoinedTeamsIdentifier(o2) : o1 === o2;
  }

  addJoinedTeamsToCollectionIfMissing<Type extends Pick<IJoinedTeams, 'id'>>(
    joinedTeamsCollection: Type[],
    ...joinedTeamsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const joinedTeams: Type[] = joinedTeamsToCheck.filter(isPresent);
    if (joinedTeams.length > 0) {
      const joinedTeamsCollectionIdentifiers = joinedTeamsCollection.map(
        joinedTeamsItem => this.getJoinedTeamsIdentifier(joinedTeamsItem)!
      );
      const joinedTeamsToAdd = joinedTeams.filter(joinedTeamsItem => {
        const joinedTeamsIdentifier = this.getJoinedTeamsIdentifier(joinedTeamsItem);
        if (joinedTeamsCollectionIdentifiers.includes(joinedTeamsIdentifier)) {
          return false;
        }
        joinedTeamsCollectionIdentifiers.push(joinedTeamsIdentifier);
        return true;
      });
      return [...joinedTeamsToAdd, ...joinedTeamsCollection];
    }
    return joinedTeamsCollection;
  }

  protected convertDateFromClient<T extends IJoinedTeams | NewJoinedTeams | PartialUpdateJoinedTeams>(joinedTeams: T): RestOf<T> {
    return {
      ...joinedTeams,
      memberSince: joinedTeams.memberSince?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restJoinedTeams: RestJoinedTeams): IJoinedTeams {
    return {
      ...restJoinedTeams,
      memberSince: restJoinedTeams.memberSince ? dayjs(restJoinedTeams.memberSince) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestJoinedTeams>): HttpResponse<IJoinedTeams> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestJoinedTeams[]>): HttpResponse<IJoinedTeams[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
