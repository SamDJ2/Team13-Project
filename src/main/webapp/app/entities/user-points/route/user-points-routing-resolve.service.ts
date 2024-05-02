import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserPoints } from '../user-points.model';
import { UserPointsService } from '../service/user-points.service';

@Injectable({ providedIn: 'root' })
export class UserPointsRoutingResolveService implements Resolve<IUserPoints | null> {
  constructor(protected service: UserPointsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserPoints | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userPoints: HttpResponse<IUserPoints>) => {
          if (userPoints.body) {
            return of(userPoints.body);
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
