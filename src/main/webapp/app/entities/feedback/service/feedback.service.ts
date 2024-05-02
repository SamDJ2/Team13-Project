import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeedback, NewFeedback } from '../feedback.model';

export type PartialUpdateFeedback = Partial<IFeedback> & Pick<IFeedback, 'id'>;

export type EntityResponseType = HttpResponse<IFeedback>;
export type EntityArrayResponseType = HttpResponse<IFeedback[]>;

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/feedbacks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feedback: NewFeedback): Observable<EntityResponseType> {
    return this.http.post<IFeedback>(this.resourceUrl, feedback, { observe: 'response' });
  }

  update(feedback: IFeedback): Observable<EntityResponseType> {
    return this.http.put<IFeedback>(`${this.resourceUrl}/${this.getFeedbackIdentifier(feedback)}`, feedback, { observe: 'response' });
  }

  partialUpdate(feedback: PartialUpdateFeedback): Observable<EntityResponseType> {
    return this.http.patch<IFeedback>(`${this.resourceUrl}/${this.getFeedbackIdentifier(feedback)}`, feedback, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFeedback>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFeedback[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeedbackIdentifier(feedback: Pick<IFeedback, 'id'>): number {
    return feedback.id;
  }

  compareFeedback(o1: Pick<IFeedback, 'id'> | null, o2: Pick<IFeedback, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeedbackIdentifier(o1) === this.getFeedbackIdentifier(o2) : o1 === o2;
  }

  addFeedbackToCollectionIfMissing<Type extends Pick<IFeedback, 'id'>>(
    feedbackCollection: Type[],
    ...feedbacksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const feedbacks: Type[] = feedbacksToCheck.filter(isPresent);
    if (feedbacks.length > 0) {
      const feedbackCollectionIdentifiers = feedbackCollection.map(feedbackItem => this.getFeedbackIdentifier(feedbackItem)!);
      const feedbacksToAdd = feedbacks.filter(feedbackItem => {
        const feedbackIdentifier = this.getFeedbackIdentifier(feedbackItem);
        if (feedbackCollectionIdentifiers.includes(feedbackIdentifier)) {
          return false;
        }
        feedbackCollectionIdentifiers.push(feedbackIdentifier);
        return true;
      });
      return [...feedbacksToAdd, ...feedbackCollection];
    }
    return feedbackCollection;
  }
}
