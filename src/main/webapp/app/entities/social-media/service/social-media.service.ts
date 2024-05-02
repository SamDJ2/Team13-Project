import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISocialMedia, NewSocialMedia } from '../social-media.model';

export type PartialUpdateSocialMedia = Partial<ISocialMedia> & Pick<ISocialMedia, 'id'>;

export type EntityResponseType = HttpResponse<ISocialMedia>;
export type EntityArrayResponseType = HttpResponse<ISocialMedia[]>;

@Injectable({ providedIn: 'root' })
export class SocialMediaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/social-medias');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(socialMedia: NewSocialMedia): Observable<EntityResponseType> {
    return this.http.post<ISocialMedia>(this.resourceUrl, socialMedia, { observe: 'response' });
  }

  update(socialMedia: ISocialMedia): Observable<EntityResponseType> {
    return this.http.put<ISocialMedia>(`${this.resourceUrl}/${this.getSocialMediaIdentifier(socialMedia)}`, socialMedia, {
      observe: 'response',
    });
  }

  partialUpdate(socialMedia: PartialUpdateSocialMedia): Observable<EntityResponseType> {
    return this.http.patch<ISocialMedia>(`${this.resourceUrl}/${this.getSocialMediaIdentifier(socialMedia)}`, socialMedia, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISocialMedia>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISocialMedia[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSocialMediaIdentifier(socialMedia: Pick<ISocialMedia, 'id'>): number {
    return socialMedia.id;
  }

  compareSocialMedia(o1: Pick<ISocialMedia, 'id'> | null, o2: Pick<ISocialMedia, 'id'> | null): boolean {
    return o1 && o2 ? this.getSocialMediaIdentifier(o1) === this.getSocialMediaIdentifier(o2) : o1 === o2;
  }

  addSocialMediaToCollectionIfMissing<Type extends Pick<ISocialMedia, 'id'>>(
    socialMediaCollection: Type[],
    ...socialMediasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const socialMedias: Type[] = socialMediasToCheck.filter(isPresent);
    if (socialMedias.length > 0) {
      const socialMediaCollectionIdentifiers = socialMediaCollection.map(
        socialMediaItem => this.getSocialMediaIdentifier(socialMediaItem)!
      );
      const socialMediasToAdd = socialMedias.filter(socialMediaItem => {
        const socialMediaIdentifier = this.getSocialMediaIdentifier(socialMediaItem);
        if (socialMediaCollectionIdentifiers.includes(socialMediaIdentifier)) {
          return false;
        }
        socialMediaCollectionIdentifiers.push(socialMediaIdentifier);
        return true;
      });
      return [...socialMediasToAdd, ...socialMediaCollection];
    }
    return socialMediaCollection;
  }
}
