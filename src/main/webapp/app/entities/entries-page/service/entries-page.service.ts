import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEntriesPage, NewEntriesPage } from '../entries-page.model';

export type PartialUpdateEntriesPage = Partial<IEntriesPage> & Pick<IEntriesPage, 'id'>;

type RestOf<T extends IEntriesPage | NewEntriesPage> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestEntriesPage = RestOf<IEntriesPage>;

export type NewRestEntriesPage = RestOf<NewEntriesPage>;

export type PartialUpdateRestEntriesPage = RestOf<PartialUpdateEntriesPage>;

export type EntityResponseType = HttpResponse<IEntriesPage>;
export type EntityArrayResponseType = HttpResponse<IEntriesPage[]>;

@Injectable({ providedIn: 'root' })
export class EntriesPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/entries-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(entriesPage: NewEntriesPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesPage);
    return this.http
      .post<RestEntriesPage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(entriesPage: IEntriesPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesPage);
    return this.http
      .put<RestEntriesPage>(`${this.resourceUrl}/${this.getEntriesPageIdentifier(entriesPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(entriesPage: PartialUpdateEntriesPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(entriesPage);
    return this.http
      .patch<RestEntriesPage>(`${this.resourceUrl}/${this.getEntriesPageIdentifier(entriesPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestEntriesPage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestEntriesPage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEntriesPageIdentifier(entriesPage: Pick<IEntriesPage, 'id'>): number {
    return entriesPage.id;
  }

  compareEntriesPage(o1: Pick<IEntriesPage, 'id'> | null, o2: Pick<IEntriesPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getEntriesPageIdentifier(o1) === this.getEntriesPageIdentifier(o2) : o1 === o2;
  }

  addEntriesPageToCollectionIfMissing<Type extends Pick<IEntriesPage, 'id'>>(
    entriesPageCollection: Type[],
    ...entriesPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const entriesPages: Type[] = entriesPagesToCheck.filter(isPresent);
    if (entriesPages.length > 0) {
      const entriesPageCollectionIdentifiers = entriesPageCollection.map(
        entriesPageItem => this.getEntriesPageIdentifier(entriesPageItem)!
      );
      const entriesPagesToAdd = entriesPages.filter(entriesPageItem => {
        const entriesPageIdentifier = this.getEntriesPageIdentifier(entriesPageItem);
        if (entriesPageCollectionIdentifiers.includes(entriesPageIdentifier)) {
          return false;
        }
        entriesPageCollectionIdentifiers.push(entriesPageIdentifier);
        return true;
      });
      return [...entriesPagesToAdd, ...entriesPageCollection];
    }
    return entriesPageCollection;
  }

  protected convertDateFromClient<T extends IEntriesPage | NewEntriesPage | PartialUpdateEntriesPage>(entriesPage: T): RestOf<T> {
    return {
      ...entriesPage,
      date: entriesPage.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restEntriesPage: RestEntriesPage): IEntriesPage {
    return {
      ...restEntriesPage,
      date: restEntriesPage.date ? dayjs(restEntriesPage.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestEntriesPage>): HttpResponse<IEntriesPage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestEntriesPage[]>): HttpResponse<IEntriesPage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
