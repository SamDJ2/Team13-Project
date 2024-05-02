import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IBadges } from '../badges.model';
import { BadgesService } from '../service/badges.service';

@Injectable({ providedIn: 'root' })
export class BadgesRoutingResolveService implements Resolve<IBadges | null> {
  constructor(protected service: BadgesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IBadges | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((badges: HttpResponse<IBadges>) => {
          if (badges.body) {
            return of(badges.body);
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
