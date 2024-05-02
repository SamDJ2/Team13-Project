import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHistory } from '../history.model';
import { HistoryService } from '../service/history.service';

@Injectable({ providedIn: 'root' })
export class HistoryRoutingResolveService implements Resolve<IHistory | null> {
  constructor(protected service: HistoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHistory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((history: HttpResponse<IHistory>) => {
          if (history.body) {
            return of(history.body);
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
