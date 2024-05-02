import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPromptsPage, NewPromptsPage } from '../prompts-page.model';

export type PartialUpdatePromptsPage = Partial<IPromptsPage> & Pick<IPromptsPage, 'id'>;

type RestOf<T extends IPromptsPage | NewPromptsPage> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestPromptsPage = RestOf<IPromptsPage>;

export type NewRestPromptsPage = RestOf<NewPromptsPage>;

export type PartialUpdateRestPromptsPage = RestOf<PartialUpdatePromptsPage>;

export type EntityResponseType = HttpResponse<IPromptsPage>;
export type EntityArrayResponseType = HttpResponse<IPromptsPage[]>;

@Injectable({ providedIn: 'root' })
export class PromptsPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prompts-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(promptsPage: NewPromptsPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsPage);
    return this.http
      .post<RestPromptsPage>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(promptsPage: IPromptsPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsPage);
    return this.http
      .put<RestPromptsPage>(`${this.resourceUrl}/${this.getPromptsPageIdentifier(promptsPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(promptsPage: PartialUpdatePromptsPage): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsPage);
    return this.http
      .patch<RestPromptsPage>(`${this.resourceUrl}/${this.getPromptsPageIdentifier(promptsPage)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPromptsPage>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPromptsPage[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPromptsPageIdentifier(promptsPage: Pick<IPromptsPage, 'id'>): number {
    return promptsPage.id;
  }

  comparePromptsPage(o1: Pick<IPromptsPage, 'id'> | null, o2: Pick<IPromptsPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getPromptsPageIdentifier(o1) === this.getPromptsPageIdentifier(o2) : o1 === o2;
  }

  addPromptsPageToCollectionIfMissing<Type extends Pick<IPromptsPage, 'id'>>(
    promptsPageCollection: Type[],
    ...promptsPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const promptsPages: Type[] = promptsPagesToCheck.filter(isPresent);
    if (promptsPages.length > 0) {
      const promptsPageCollectionIdentifiers = promptsPageCollection.map(
        promptsPageItem => this.getPromptsPageIdentifier(promptsPageItem)!
      );
      const promptsPagesToAdd = promptsPages.filter(promptsPageItem => {
        const promptsPageIdentifier = this.getPromptsPageIdentifier(promptsPageItem);
        if (promptsPageCollectionIdentifiers.includes(promptsPageIdentifier)) {
          return false;
        }
        promptsPageCollectionIdentifiers.push(promptsPageIdentifier);
        return true;
      });
      return [...promptsPagesToAdd, ...promptsPageCollection];
    }
    return promptsPageCollection;
  }

  protected convertDateFromClient<T extends IPromptsPage | NewPromptsPage | PartialUpdatePromptsPage>(promptsPage: T): RestOf<T> {
    return {
      ...promptsPage,
      date: promptsPage.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restPromptsPage: RestPromptsPage): IPromptsPage {
    return {
      ...restPromptsPage,
      date: restPromptsPage.date ? dayjs(restPromptsPage.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPromptsPage>): HttpResponse<IPromptsPage> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPromptsPage[]>): HttpResponse<IPromptsPage[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
