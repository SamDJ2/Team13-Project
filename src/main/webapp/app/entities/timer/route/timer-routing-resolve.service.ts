import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITimer } from '../timer.model';
import { TimerService } from '../service/timer.service';

@Injectable({ providedIn: 'root' })
export class TimerRoutingResolveService implements Resolve<ITimer | null> {
  constructor(protected service: TimerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITimer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((timer: HttpResponse<ITimer>) => {
          if (timer.body) {
            return of(timer.body);
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
