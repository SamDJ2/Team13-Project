import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAchievement, NewAchievement } from '../achievement.model';

export type PartialUpdateAchievement = Partial<IAchievement> & Pick<IAchievement, 'id'>;

type RestOf<T extends IAchievement | NewAchievement> = Omit<T, 'dateEarned'> & {
  dateEarned?: string | null;
};

export type RestAchievement = RestOf<IAchievement>;

export type NewRestAchievement = RestOf<NewAchievement>;

export type PartialUpdateRestAchievement = RestOf<PartialUpdateAchievement>;

export type EntityResponseType = HttpResponse<IAchievement>;
export type EntityArrayResponseType = HttpResponse<IAchievement[]>;

@Injectable({ providedIn: 'root' })
export class AchievementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/achievements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(achievement: NewAchievement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(achievement);
    return this.http
      .post<RestAchievement>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(achievement: IAchievement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(achievement);
    return this.http
      .put<RestAchievement>(`${this.resourceUrl}/${this.getAchievementIdentifier(achievement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(achievement: PartialUpdateAchievement): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(achievement);
    return this.http
      .patch<RestAchievement>(`${this.resourceUrl}/${this.getAchievementIdentifier(achievement)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestAchievement>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestAchievement[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAchievementIdentifier(achievement: Pick<IAchievement, 'id'>): number {
    return achievement.id;
  }

  compareAchievement(o1: Pick<IAchievement, 'id'> | null, o2: Pick<IAchievement, 'id'> | null): boolean {
    return o1 && o2 ? this.getAchievementIdentifier(o1) === this.getAchievementIdentifier(o2) : o1 === o2;
  }

  addAchievementToCollectionIfMissing<Type extends Pick<IAchievement, 'id'>>(
    achievementCollection: Type[],
    ...achievementsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const achievements: Type[] = achievementsToCheck.filter(isPresent);
    if (achievements.length > 0) {
      const achievementCollectionIdentifiers = achievementCollection.map(
        achievementItem => this.getAchievementIdentifier(achievementItem)!
      );
      const achievementsToAdd = achievements.filter(achievementItem => {
        const achievementIdentifier = this.getAchievementIdentifier(achievementItem);
        if (achievementCollectionIdentifiers.includes(achievementIdentifier)) {
          return false;
        }
        achievementCollectionIdentifiers.push(achievementIdentifier);
        return true;
      });
      return [...achievementsToAdd, ...achievementCollection];
    }
    return achievementCollection;
  }

  protected convertDateFromClient<T extends IAchievement | NewAchievement | PartialUpdateAchievement>(achievement: T): RestOf<T> {
    return {
      ...achievement,
      dateEarned: achievement.dateEarned?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restAchievement: RestAchievement): IAchievement {
    return {
      ...restAchievement,
      dateEarned: restAchievement.dateEarned ? dayjs(restAchievement.dateEarned) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestAchievement>): HttpResponse<IAchievement> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestAchievement[]>): HttpResponse<IAchievement[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
