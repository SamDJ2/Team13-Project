import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { PromptsFeature, NewPromptsFeature } from '../prompts-feature.model';

export type PartialUpdatePromptsFeature = Partial<PromptsFeature> & Pick<PromptsFeature, 'id'>;

type RestOf<T extends PromptsFeature | NewPromptsFeature> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestPromptsFeature = RestOf<PromptsFeature>;

export type NewRestPromptsFeature = RestOf<NewPromptsFeature>;

export type PartialUpdateRestPromptsFeature = RestOf<PartialUpdatePromptsFeature>;

export type EntityResponseType = HttpResponse<PromptsFeature>;
export type EntityArrayResponseType = HttpResponse<PromptsFeature[]>;

@Injectable({ providedIn: 'root' })
export class PromptsFeatureService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/prompts-features');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(promptsFeature: NewPromptsFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsFeature);
    return this.http
      .post<RestPromptsFeature>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(promptsFeature: PromptsFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsFeature);
    return this.http
      .put<RestPromptsFeature>(`${this.resourceUrl}/${this.getPromptsFeatureIdentifier(promptsFeature)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(promptsFeature: PartialUpdatePromptsFeature): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(promptsFeature);
    return this.http
      .patch<RestPromptsFeature>(`${this.resourceUrl}/${this.getPromptsFeatureIdentifier(promptsFeature)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestPromptsFeature>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestPromptsFeature[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPromptsFeatureIdentifier(promptsFeature: Pick<PromptsFeature, 'id'>): number {
    return promptsFeature.id;
  }

  comparePromptsFeature(o1: Pick<PromptsFeature, 'id'> | null, o2: Pick<PromptsFeature, 'id'> | null): boolean {
    return o1 && o2 ? this.getPromptsFeatureIdentifier(o1) === this.getPromptsFeatureIdentifier(o2) : o1 === o2;
  }

  addPromptsFeatureToCollectionIfMissing<Type extends Pick<PromptsFeature, 'id'>>(
    promptsFeatureCollection: Type[],
    ...promptsFeaturesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const promptsFeatures: Type[] = promptsFeaturesToCheck.filter(isPresent);
    if (promptsFeatures.length > 0) {
      const promptsFeatureCollectionIdentifiers = promptsFeatureCollection.map(
        promptsFeatureItem => this.getPromptsFeatureIdentifier(promptsFeatureItem)!
      );
      const promptsFeaturesToAdd = promptsFeatures.filter(promptsFeatureItem => {
        const promptsFeatureIdentifier = this.getPromptsFeatureIdentifier(promptsFeatureItem);
        if (promptsFeatureCollectionIdentifiers.includes(promptsFeatureIdentifier)) {
          return false;
        }
        promptsFeatureCollectionIdentifiers.push(promptsFeatureIdentifier);
        return true;
      });
      return [...promptsFeaturesToAdd, ...promptsFeatureCollection];
    }
    return promptsFeatureCollection;
  }

  getAll(): Observable<PromptsFeature[]> {
    return this.http.get<PromptsFeature[]>(this.resourceUrl);
  }

  protected convertDateFromClient<T extends PromptsFeature | NewPromptsFeature | PartialUpdatePromptsFeature>(
    promptsFeature: T
  ): RestOf<T> {
    return {
      ...promptsFeature,
      date: promptsFeature.date ? dayjs(promptsFeature.date).format(DATE_FORMAT) : null,
    };
  }

  protected convertDateFromServer(restPromptsFeature: RestPromptsFeature): PromptsFeature {
    return {
      ...restPromptsFeature,
      date: restPromptsFeature.date ? dayjs(restPromptsFeature.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestPromptsFeature>): HttpResponse<PromptsFeature> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestPromptsFeature[]>): HttpResponse<PromptsFeature[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
