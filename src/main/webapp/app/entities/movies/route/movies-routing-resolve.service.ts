import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMovies } from '../movies.model';
import { MoviesService } from '../service/movies.service';

@Injectable({ providedIn: 'root' })
export class MoviesRoutingResolveService implements Resolve<IMovies | null> {
  constructor(protected service: MoviesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMovies | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((movies: HttpResponse<IMovies>) => {
          if (movies.body) {
            return of(movies.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
