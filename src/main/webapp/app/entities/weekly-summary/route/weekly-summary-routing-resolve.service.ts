import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWeeklySummary } from '../weekly-summary.model';
import { WeeklySummaryService } from '../service/weekly-summary.service';

@Injectable({ providedIn: 'root' })
export class WeeklySummaryRoutingResolveService implements Resolve<IWeeklySummary | null> {
  constructor(protected service: WeeklySummaryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWeeklySummary | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((weeklySummary: HttpResponse<IWeeklySummary>) => {
          if (weeklySummary.body) {
            return of(weeklySummary.body);
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
