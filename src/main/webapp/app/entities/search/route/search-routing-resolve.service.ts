import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISearch } from '../search.model';
import { SearchService } from '../service/search.service';

@Injectable({ providedIn: 'root' })
export class SearchRoutingResolveService implements Resolve<ISearch | null> {
  constructor(protected service: SearchService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISearch | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((search: HttpResponse<ISearch>) => {
          if (search.body) {
            return of(search.body);
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
