import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISmoking } from '../smoking.model';
import { SmokingService } from '../service/smoking.service';

@Injectable({ providedIn: 'root' })
export class SmokingRoutingResolveService implements Resolve<ISmoking | null> {
  constructor(protected service: SmokingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISmoking | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((smoking: HttpResponse<ISmoking>) => {
          if (smoking.body) {
            return of(smoking.body);
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
