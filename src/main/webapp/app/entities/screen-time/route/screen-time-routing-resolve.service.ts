import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IScreenTime } from '../screen-time.model';
import { ScreenTimeService } from '../service/screen-time.service';

@Injectable({ providedIn: 'root' })
export class ScreenTimeRoutingResolveService implements Resolve<IScreenTime | null> {
  constructor(protected service: ScreenTimeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IScreenTime | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((screenTime: HttpResponse<IScreenTime>) => {
          if (screenTime.body) {
            return of(screenTime.body);
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
