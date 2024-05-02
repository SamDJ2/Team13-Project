import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmotionPage, NewEmotionPage } from '../emotion-page.model';

export type PartialUpdateEmotionPage = Partial<IEmotionPage> & Pick<IEmotionPage, 'id'>;

type RestOf<T extends IEmotionPage | NewEmotionPage> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEmotionPage = RestOf<IEmotionPage>;

export type NewRestEmotionPage = RestOf<NewEmotionPage>;

export type PartialUpdateRestEmotionPage = RestOf<PartialUpdateEmotionPage>;

export type EntityResponseType = HttpResponse<IEmotionPage>;
export type EntityArrayResponseType = HttpResponse<IEmotionPage[]>;

@Injectable({ providedIn: 'root' })
export class EmotionPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/emotion-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(emotionPage: NewEmotionPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emotionPage);
    return this.http
      .post<RestEmotionPage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(emotionPage: IEmotionPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emotionPage);
    return this.http
      .put<RestEmotionPage>(`${this.resourceUrl}/${this.getEmotionPageIdentifier(emotionPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(emotionPage: PartialUpdateEmotionPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(emotionPage);
    return this.http
      .patch<RestEmotionPage>(`${this.resourceUrl}/${this.getEmotionPageIdentifier(emotionPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEmotionPage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEmotionPage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEmotionPageIdentifier(emotionPage: Pick<IEmotionPage, 'id'>): number {
    return emotionPage.id;
  }

  compareEmotionPage(o1: Pick<IEmotionPage, 'id'> | null, o2: Pick<IEmotionPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getEmotionPageIdentifier(o1) === this.getEmotionPageIdentifier(o2) : o1 === o2;
  }

  addEmotionPageToCollectionIfMissing<Type extends Pick<IEmotionPage, 'id'>>(
    emotionPageCollection: Type[],
    ...emotionPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const emotionPages: Type[] = emotionPagesToCheck.filter(isPresent);
    if (emotionPages.length > 0) {
      const emotionPageCollectionIdentifiers = emotionPageCollection.map(
        emotionPageItem => this.getEmotionPageIdentifier(emotionPageItem)!
      );
      const emotionPagesToAdd = emotionPages.filter(emotionPageItem => {
        const emotionPageIdentifier = this.getEmotionPageIdentifier(emotionPageItem);
        if (emotionPageCollectionIdentifiers.includes(emotionPageIdentifier)) {
          return false;
        }
        emotionPageCollectionIdentifiers.push(emotionPageIdentifier);
        return true;
      });
      return [...emotionPagesToAdd, ...emotionPageCollection];
    }
    return emotionPageCollection;
  }

  protected convertDateFromClient<T extends IEmotionPage | NewEmotionPage | PartialUpdateEmotionPage>(emotionPage: T): RestOf<T> {
    return {
      ...emotionPage,
      date: emotionPage.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEmotionPage: RestEmotionPage): IEmotionPage {
    return {
      ...restEmotionPage,
      date: restEmotionPage.date ? dayjs(restEmotionPage.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEmotionPage>): HttpResponse<IEmotionPage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEmotionPage[]>): HttpResponse<IEmotionPage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
