import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrouping, NewGrouping } from '../grouping.model';

export type PartialUpdateGrouping = Partial<IGrouping> & Pick<IGrouping, 'id'>;

type RestOf<T extends IGrouping | NewGrouping> = Omit<T, 'currentDate'> & {
  currentDate?: string | null;
};

export type RestGrouping = RestOf<IGrouping>;

export type NewRestGrouping = RestOf<NewGrouping>;

export type PartialUpdateRestGrouping = RestOf<PartialUpdateGrouping>;

export type EntityResponseType = HttpResponse<IGrouping>;
export type EntityArrayResponseType = HttpResponse<IGrouping[]>;

@Injectable({ providedIn: 'root' })
export class GroupingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/groupings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grouping: NewGrouping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grouping);
    return this.http
      .post<RestGrouping>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(grouping: IGrouping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grouping);
    return this.http
      .put<RestGrouping>(`${this.resourceUrl}/${this.getGroupingIdentifier(grouping)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(grouping: PartialUpdateGrouping): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(grouping);
    return this.http
      .patch<RestGrouping>(`${this.resourceUrl}/${this.getGroupingIdentifier(grouping)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestGrouping>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestGrouping[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGroupingIdentifier(grouping: Pick<IGrouping, 'id'>): number {
    return grouping.id;
  }

  compareGrouping(o1: Pick<IGrouping, 'id'> | null, o2: Pick<IGrouping, 'id'> | null): boolean {
    return o1 && o2 ? this.getGroupingIdentifier(o1) === this.getGroupingIdentifier(o2) : o1 === o2;
  }

  addGroupingToCollectionIfMissing<Type extends Pick<IGrouping, 'id'>>(
    groupingCollection: Type[],
    ...groupingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const groupings: Type[] = groupingsToCheck.filter(isPresent);
    if (groupings.length > 0) {
      const groupingCollectionIdentifiers = groupingCollection.map(groupingItem => this.getGroupingIdentifier(groupingItem)!);
      const groupingsToAdd = groupings.filter(groupingItem => {
        const groupingIdentifier = this.getGroupingIdentifier(groupingItem);
        if (groupingCollectionIdentifiers.includes(groupingIdentifier)) {
          return false;
        }
        groupingCollectionIdentifiers.push(groupingIdentifier);
        return true;
      });
      return [...groupingsToAdd, ...groupingCollection];
    }
    return groupingCollection;
  }

  protected convertDateFromClient<T extends IGrouping | NewGrouping | PartialUpdateGrouping>(grouping: T): RestOf<T> {
    return {
      ...grouping,
      currentDate: grouping.currentDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restGrouping: RestGrouping): IGrouping {
    return {
      ...restGrouping,
      currentDate: restGrouping.currentDate ? dayjs(restGrouping.currentDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestGrouping>): HttpResponse<IGrouping> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestGrouping[]>): HttpResponse<IGrouping[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
