import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMusic, NewMusic } from '../music.model';

export type PartialUpdateMusic = Partial<IMusic> & Pick<IMusic, 'id'>;

export type EntityResponseType = HttpResponse<IMusic>;
export type EntityArrayResponseType = HttpResponse<IMusic[]>;

@Injectable({ providedIn: 'root' })
export class MusicService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/music');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(music: NewMusic): Observable<EntityResponseType> {
    return this.http.post<IMusic>(this.resourceUrl, music, { observe: 'response' });
  }

  update(music: IMusic): Observable<EntityResponseType> {
    return this.http.put<IMusic>(`${this.resourceUrl}/${this.getMusicIdentifier(music)}`, music, { observe: 'response' });
  }

  partialUpdate(music: PartialUpdateMusic): Observable<EntityResponseType> {
    return this.http.patch<IMusic>(`${this.resourceUrl}/${this.getMusicIdentifier(music)}`, music, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMusic>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMusic[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMusicIdentifier(music: Pick<IMusic, 'id'>): number {
    return music.id;
  }

  compareMusic(o1: Pick<IMusic, 'id'> | null, o2: Pick<IMusic, 'id'> | null): boolean {
    return o1 && o2 ? this.getMusicIdentifier(o1) === this.getMusicIdentifier(o2) : o1 === o2;
  }

  addMusicToCollectionIfMissing<Type extends Pick<IMusic, 'id'>>(
    musicCollection: Type[],
    ...musicToCheck: (Type | null | undefined)[]
  ): Type[] {
    const music: Type[] = musicToCheck.filter(isPresent);
    if (music.length > 0) {
      const musicCollectionIdentifiers = musicCollection.map(musicItem => this.getMusicIdentifier(musicItem)!);
      const musicToAdd = music.filter(musicItem => {
        const musicIdentifier = this.getMusicIdentifier(musicItem);
        if (musicCollectionIdentifiers.includes(musicIdentifier)) {
          return false;
        }
        musicCollectionIdentifiers.push(musicIdentifier);
        return true;
      });
      return [...musicToAdd, ...musicCollection];
    }
    return musicCollection;
  }
}
