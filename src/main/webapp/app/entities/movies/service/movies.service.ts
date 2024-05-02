import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMovies, NewMovies } from '../movies.model';

export type PartialUpdateMovies = Partial<IMovies> & Pick<IMovies, 'id'>;

export type EntityResponseType = HttpResponse<IMovies>;
export type EntityArrayResponseType = HttpResponse<IMovies[]>;

@Injectable({ providedIn: 'root' })
export class MoviesService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/movies');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(movies: NewMovies): Observable<EntityResponseType> {
    return this.http.post<IMovies>(this.resourceUrl, movies, { observe: 'response' });
  }

  update(movies: IMovies): Observable<EntityResponseType> {
    return this.http.put<IMovies>(`${this.resourceUrl}/${this.getMoviesIdentifier(movies)}`, movies, { observe: 'response' });
  }

  partialUpdate(movies: PartialUpdateMovies): Observable<EntityResponseType> {
    return this.http.patch<IMovies>(`${this.resourceUrl}/${this.getMoviesIdentifier(movies)}`, movies, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMovies>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMovies[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMoviesIdentifier(movies: Pick<IMovies, 'id'>): number {
    return movies.id;
  }

  compareMovies(o1: Pick<IMovies, 'id'> | null, o2: Pick<IMovies, 'id'> | null): boolean {
    return o1 && o2 ? this.getMoviesIdentifier(o1) === this.getMoviesIdentifier(o2) : o1 === o2;
  }

  addMoviesToCollectionIfMissing<Type extends Pick<IMovies, 'id'>>(
    moviesCollection: Type[],
    ...moviesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const movies: Type[] = moviesToCheck.filter(isPresent);
    if (movies.length > 0) {
      const moviesCollectionIdentifiers = moviesCollection.map(moviesItem => this.getMoviesIdentifier(moviesItem)!);
      const moviesToAdd = movies.filter(moviesItem => {
        const moviesIdentifier = this.getMoviesIdentifier(moviesItem);
        if (moviesCollectionIdentifiers.includes(moviesIdentifier)) {
          return false;
        }
        moviesCollectionIdentifiers.push(moviesIdentifier);
        return true;
      });
      return [...moviesToAdd, ...moviesCollection];
    }
    return moviesCollection;
  }
}
