import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEntriesPage } from '../entries-page.model';
import { EntriesPageService } from '../service/entries-page.service';

@Injectable({ providedIn: 'root' })
export class EntriesPageRoutingResolveService implements Resolve<IEntriesPage | null> {
  constructor(protected service: EntriesPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEntriesPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((entriesPage: HttpResponse<IEntriesPage>) => {
          if (entriesPage.body) {
            return of(entriesPage.body);
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
