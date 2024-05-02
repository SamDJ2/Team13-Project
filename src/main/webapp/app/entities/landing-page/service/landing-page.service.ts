import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILandingPage, NewLandingPage } from '../landing-page.model';

export type PartialUpdateLandingPage = Partial<ILandingPage> & Pick<ILandingPage, 'id'>;

export type EntityResponseType = HttpResponse<ILandingPage>;
export type EntityArrayResponseType = HttpResponse<ILandingPage[]>;

@Injectable({ providedIn: 'root' })
export class LandingPageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/landing-pages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(landingPage: NewLandingPage): Observable<EntityResponseType> {
    return this.http.post<ILandingPage>(this.resourceUrl, landingPage, { observe: 'response' });
  }

  update(landingPage: ILandingPage): Observable<EntityResponseType> {
    return this.http.put<ILandingPage>(`${this.resourceUrl}/${this.getLandingPageIdentifier(landingPage)}`, landingPage, {
      observe: 'response',
    });
  }

  partialUpdate(landingPage: PartialUpdateLandingPage): Observable<EntityResponseType> {
    return this.http.patch<ILandingPage>(`${this.resourceUrl}/${this.getLandingPageIdentifier(landingPage)}`, landingPage, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILandingPage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILandingPage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLandingPageIdentifier(landingPage: Pick<ILandingPage, 'id'>): number {
    return landingPage.id;
  }

  compareLandingPage(o1: Pick<ILandingPage, 'id'> | null, o2: Pick<ILandingPage, 'id'> | null): boolean {
    return o1 && o2 ? this.getLandingPageIdentifier(o1) === this.getLandingPageIdentifier(o2) : o1 === o2;
  }

  addLandingPageToCollectionIfMissing<Type extends Pick<ILandingPage, 'id'>>(
    landingPageCollection: Type[],
    ...landingPagesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const landingPages: Type[] = landingPagesToCheck.filter(isPresent);
    if (landingPages.length > 0) {
      const landingPageCollectionIdentifiers = landingPageCollection.map(
        landingPageItem => this.getLandingPageIdentifier(landingPageItem)!
      );
      const landingPagesToAdd = landingPages.filter(landingPageItem => {
        const landingPageIdentifier = this.getLandingPageIdentifier(landingPageItem);
        if (landingPageCollectionIdentifiers.includes(landingPageIdentifier)) {
          return false;
        }
        landingPageCollectionIdentifiers.push(landingPageIdentifier);
        return true;
      });
      return [...landingPagesToAdd, ...landingPageCollection];
    }
    return landingPageCollection;
  }
}
