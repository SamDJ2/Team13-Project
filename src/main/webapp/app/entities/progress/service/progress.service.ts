import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProgress, NewProgress } from '../progress.model';

export type PartialUpdateProgress = Partial<IProgress> & Pick<IProgress, 'id'>;

export type EntityResponseType = HttpResponse<IProgress>;
export type EntityArrayResponseType = HttpResponse<IProgress[]>;

@Injectable({ providedIn: 'root' })
export class ProgressService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/progresses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(progress: NewProgress): Observable<EntityResponseType> {
    return this.http.post<IProgress>(this.resourceUrl, progress, { observe: 'response' });
  }

  update(progress: IProgress): Observable<EntityResponseType> {
    return this.http.put<IProgress>(`${this.resourceUrl}/${this.getProgressIdentifier(progress)}`, progress, { observe: 'response' });
  }

  partialUpdate(progress: PartialUpdateProgress): Observable<EntityResponseType> {
    return this.http.patch<IProgress>(`${this.resourceUrl}/${this.getProgressIdentifier(progress)}`, progress, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProgress>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProgress[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProgressIdentifier(progress: Pick<IProgress, 'id'>): number {
    return progress.id;
  }

  compareProgress(o1: Pick<IProgress, 'id'> | null, o2: Pick<IProgress, 'id'> | null): boolean {
    return o1 && o2 ? this.getProgressIdentifier(o1) === this.getProgressIdentifier(o2) : o1 === o2;
  }

  addProgressToCollectionIfMissing<Type extends Pick<IProgress, 'id'>>(
    progressCollection: Type[],
    ...progressesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const progresses: Type[] = progressesToCheck.filter(isPresent);
    if (progresses.length > 0) {
      const progressCollectionIdentifiers = progressCollection.map(progressItem => this.getProgressIdentifier(progressItem)!);
      const progressesToAdd = progresses.filter(progressItem => {
        const progressIdentifier = this.getProgressIdentifier(progressItem);
        if (progressCollectionIdentifiers.includes(progressIdentifier)) {
          return false;
        }
        progressCollectionIdentifiers.push(progressIdentifier);
        return true;
      });
      return [...progressesToAdd, ...progressCollection];
    }
    return progressCollection;
  }
}
