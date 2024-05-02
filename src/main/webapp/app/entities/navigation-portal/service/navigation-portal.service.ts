import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INavigationPortal, NewNavigationPortal } from '../navigation-portal.model';

export type PartialUpdateNavigationPortal = Partial<INavigationPortal> & Pick<INavigationPortal, 'id'>;

export type EntityResponseType = HttpResponse<INavigationPortal>;
export type EntityArrayResponseType = HttpResponse<INavigationPortal[]>;

@Injectable({ providedIn: 'root' })
export class NavigationPortalService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/navigation-portals');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(navigationPortal: NewNavigationPortal): Observable<EntityResponseType> {
    return this.http.post<INavigationPortal>(this.resourceUrl, navigationPortal, { observe: 'response' });
  }

  update(navigationPortal: INavigationPortal): Observable<EntityResponseType> {
    return this.http.put<INavigationPortal>(
      `${this.resourceUrl}/${this.getNavigationPortalIdentifier(navigationPortal)}`,
      navigationPortal,
      { observe: 'response' }
    );
  }

  partialUpdate(navigationPortal: PartialUpdateNavigationPortal): Observable<EntityResponseType> {
    return this.http.patch<INavigationPortal>(
      `${this.resourceUrl}/${this.getNavigationPortalIdentifier(navigationPortal)}`,
      navigationPortal,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INavigationPortal>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INavigationPortal[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getNavigationPortalIdentifier(navigationPortal: Pick<INavigationPortal, 'id'>): number {
    return navigationPortal.id;
  }

  compareNavigationPortal(o1: Pick<INavigationPortal, 'id'> | null, o2: Pick<INavigationPortal, 'id'> | null): boolean {
    return o1 && o2 ? this.getNavigationPortalIdentifier(o1) === this.getNavigationPortalIdentifier(o2) : o1 === o2;
  }

  addNavigationPortalToCollectionIfMissing<Type extends Pick<INavigationPortal, 'id'>>(
    navigationPortalCollection: Type[],
    ...navigationPortalsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const navigationPortals: Type[] = navigationPortalsToCheck.filter(isPresent);
    if (navigationPortals.length > 0) {
      const navigationPortalCollectionIdentifiers = navigationPortalCollection.map(
        navigationPortalItem => this.getNavigationPortalIdentifier(navigationPortalItem)!
      );
      const navigationPortalsToAdd = navigationPortals.filter(navigationPortalItem => {
        const navigationPortalIdentifier = this.getNavigationPortalIdentifier(navigationPortalItem);
        if (navigationPortalCollectionIdentifiers.includes(navigationPortalIdentifier)) {
          return false;
        }
        navigationPortalCollectionIdentifiers.push(navigationPortalIdentifier);
        return true;
      });
      return [...navigationPortalsToAdd, ...navigationPortalCollection];
    }
    return navigationPortalCollection;
  }
}
