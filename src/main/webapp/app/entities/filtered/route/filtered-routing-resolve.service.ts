import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IFiltered } from '../filtered.model';
import { FilteredService } from '../service/filtered.service';

@Injectable({ providedIn: 'root' })
export class FilteredRoutingResolveService implements Resolve<IFiltered | null> {
  constructor(protected service: FilteredService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFiltered | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((filtered: HttpResponse<IFiltered>) => {
          if (filtered.body) {
            return of(filtered.body);
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
