import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IChallenges } from '../challenges.model';
import { ChallengesService } from '../service/challenges.service';

@Injectable({ providedIn: 'root' })
export class ChallengesRoutingResolveService implements Resolve<IChallenges | null> {
  constructor(protected service: ChallengesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IChallenges | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((challenges: HttpResponse<IChallenges>) => {
          if (challenges.body) {
            return of(challenges.body);
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
