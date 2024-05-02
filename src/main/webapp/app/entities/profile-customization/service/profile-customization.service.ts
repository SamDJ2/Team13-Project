import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfileCustomization, NewProfileCustomization } from '../profile-customization.model';

export type PartialUpdateProfileCustomization = Partial<IProfileCustomization> & Pick<IProfileCustomization, 'id'>;

export type EntityResponseType = HttpResponse<IProfileCustomization>;
export type EntityArrayResponseType = HttpResponse<IProfileCustomization[]>;

@Injectable({ providedIn: 'root' })
export class ProfileCustomizationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/profile-customizations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(profileCustomization: NewProfileCustomization): Observable<EntityResponseType> {
    return this.http.post<IProfileCustomization>(this.resourceUrl, profileCustomization, { observe: 'response' });
  }

  update(profileCustomization: IProfileCustomization): Observable<EntityResponseType> {
    return this.http.put<IProfileCustomization>(
      `${this.resourceUrl}/${this.getProfileCustomizationIdentifier(profileCustomization)}`,
      profileCustomization,
      { observe: 'response' }
    );
  }

  partialUpdate(profileCustomization: PartialUpdateProfileCustomization): Observable<EntityResponseType> {
    return this.http.patch<IProfileCustomization>(
      `${this.resourceUrl}/${this.getProfileCustomizationIdentifier(profileCustomization)}`,
      profileCustomization,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProfileCustomization>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfileCustomization[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getProfileCustomizationIdentifier(profileCustomization: Pick<IProfileCustomization, 'id'>): number {
    return profileCustomization.id;
  }

  compareProfileCustomization(o1: Pick<IProfileCustomization, 'id'> | null, o2: Pick<IProfileCustomization, 'id'> | null): boolean {
    return o1 && o2 ? this.getProfileCustomizationIdentifier(o1) === this.getProfileCustomizationIdentifier(o2) : o1 === o2;
  }

  addProfileCustomizationToCollectionIfMissing<Type extends Pick<IProfileCustomization, 'id'>>(
    profileCustomizationCollection: Type[],
    ...profileCustomizationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const profileCustomizations: Type[] = profileCustomizationsToCheck.filter(isPresent);
    if (profileCustomizations.length > 0) {
      const profileCustomizationCollectionIdentifiers = profileCustomizationCollection.map(
        profileCustomizationItem => this.getProfileCustomizationIdentifier(profileCustomizationItem)!
      );
      const profileCustomizationsToAdd = profileCustomizations.filter(profileCustomizationItem => {
        const profileCustomizationIdentifier = this.getProfileCustomizationIdentifier(profileCustomizationItem);
        if (profileCustomizationCollectionIdentifiers.includes(profileCustomizationIdentifier)) {
          return false;
        }
        profileCustomizationCollectionIdentifiers.push(profileCustomizationIdentifier);
        return true;
      });
      return [...profileCustomizationsToAdd, ...profileCustomizationCollection];
    }
    return profileCustomizationCollection;
  }
}
