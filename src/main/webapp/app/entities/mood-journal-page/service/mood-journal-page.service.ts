import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMoodJournalPage, NewMoodJournalPage } from '../mood-journal-page.model';

export type PartialUpdateMoodJournalPage = Partial<IMoodJournalPage> & Pick<IMoodJournalPage, 'id'>;

type RestOf<T extends IMoodJournalPage | NewMoodJournalPage> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestMoodJournalPage = RestOf<IMoodJournalPage>;

export type NewRestMoodJournalPage = RestOf<NewMoodJournalPage>;

export type PartialUpdateRestMoodJournalPage = RestOf<PartialUpdateMoodJournalPage>;

export type EntityResponseType = HttpResponse<IMoodJournalPage>;
export type EntityArrayResponseType = HttpResponse<IMoodJournalPage[]>;

@Injectable({ providedIn: 'root' })
export class MoodJournalPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/mood-journal-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(moodJournalPage: NewMoodJournalPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodJournalPage);
    return this.http
      .post<RestMoodJournalPage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(moodJournalPage: IMoodJournalPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodJournalPage);
    return this.http
      .put<RestMoodJournalPage>(`${this.resourceUrl}/${this.getMoodJournalPageIdentifier(moodJournalPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(moodJournalPage: PartialUpdateMoodJournalPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(moodJournalPage);
    return this.http
      .patch<RestMoodJournalPage>(`${this.resourceUrl}/${this.getMoodJournalPageIdentifier(moodJournalPage)}`, copy, {
        observe: 'response',
      })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestMoodJournalPage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestMoodJournalPage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMoodJournalPageIdentifier(moodJournalPage: Pick<IMoodJournalPage, 'id'>): number {
    return moodJournalPage.id;
  }

  compareMoodJournalPage(o1: Pick<IMoodJournalPage, 'id'> | null, o2: Pick<IMoodJournalPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getMoodJournalPageIdentifier(o1) === this.getMoodJournalPageIdentifier(o2) : o1 === o2;
  }

  addMoodJournalPageToCollectionIfMissing<Type extends Pick<IMoodJournalPage, 'id'>>(
    moodJournalPageCollection: Type[],
    ...moodJournalPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const moodJournalPages: Type[] = moodJournalPagesToCheck.filter(isPresent);
    if (moodJournalPages.length > 0) {
      const moodJournalPageCollectionIdentifiers = moodJournalPageCollection.map(
        moodJournalPageItem => this.getMoodJournalPageIdentifier(moodJournalPageItem)!
      );
      const moodJournalPagesToAdd = moodJournalPages.filter(moodJournalPageItem => {
        const moodJournalPageIdentifier = this.getMoodJournalPageIdentifier(moodJournalPageItem);
        if (moodJournalPageCollectionIdentifiers.includes(moodJournalPageIdentifier)) {
          return false;
        }
        moodJournalPageCollectionIdentifiers.push(moodJournalPageIdentifier);
        return true;
      });
      return [...moodJournalPagesToAdd, ...moodJournalPageCollection];
    }
    return moodJournalPageCollection;
  }

  protected convertDateFromClient<T extends IMoodJournalPage | NewMoodJournalPage | PartialUpdateMoodJournalPage>(
    moodJournalPage: T
  ): RestOf<T> {
    return {
      ...moodJournalPage,
      date: moodJournalPage.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restMoodJournalPage: RestMoodJournalPage): IMoodJournalPage {
    return {
      ...restMoodJournalPage,
      date: restMoodJournalPage.date ? dayjs(restMoodJournalPage.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestMoodJournalPage>): HttpResponse<IMoodJournalPage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestMoodJournalPage[]>): HttpResponse<IMoodJournalPage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
