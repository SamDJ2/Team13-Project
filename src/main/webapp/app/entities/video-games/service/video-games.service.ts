import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVideoGames, NewVideoGames } from '../video-games.model';

export type PartialUpdateVideoGames = Partial<IVideoGames> & Pick<IVideoGames, 'id'>;

export type EntityResponseType = HttpResponse<IVideoGames>;
export type EntityArrayResponseType = HttpResponse<IVideoGames[]>;

@Injectable({ providedIn: 'root' })
export class VideoGamesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/video-games');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(videoGames: NewVideoGames): Observable<EntityResponseType> {
    return this.http.post<IVideoGames>(this.resourceUrl, videoGames, { observe: 'response' });
  }

  update(videoGames: IVideoGames): Observable<EntityResponseType> {
    return this.http.put<IVideoGames>(`${this.resourceUrl}/${this.getVideoGamesIdentifier(videoGames)}`, videoGames, {
      observe: 'response',
    });
  }

  partialUpdate(videoGames: PartialUpdateVideoGames): Observable<EntityResponseType> {
    return this.http.patch<IVideoGames>(`${this.resourceUrl}/${this.getVideoGamesIdentifier(videoGames)}`, videoGames, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVideoGames>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVideoGames[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVideoGamesIdentifier(videoGames: Pick<IVideoGames, 'id'>): number {
    return videoGames.id;
  }

  compareVideoGames(o1: Pick<IVideoGames, 'id'> | null, o2: Pick<IVideoGames, 'id'> | null): boolean {
    return o1 && o2 ? this.getVideoGamesIdentifier(o1) === this.getVideoGamesIdentifier(o2) : o1 === o2;
  }

  addVideoGamesToCollectionIfMissing<Type extends Pick<IVideoGames, 'id'>>(
    videoGamesCollection: Type[],
    ...videoGamesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const videoGames: Type[] = videoGamesToCheck.filter(isPresent);
    if (videoGames.length > 0) {
      const videoGamesCollectionIdentifiers = videoGamesCollection.map(videoGamesItem => this.getVideoGamesIdentifier(videoGamesItem)!);
      const videoGamesToAdd = videoGames.filter(videoGamesItem => {
        const videoGamesIdentifier = this.getVideoGamesIdentifier(videoGamesItem);
        if (videoGamesCollectionIdentifiers.includes(videoGamesIdentifier)) {
          return false;
        }
        videoGamesCollectionIdentifiers.push(videoGamesIdentifier);
        return true;
      });
      return [...videoGamesToAdd, ...videoGamesCollection];
    }
    return videoGamesCollection;
  }
}
