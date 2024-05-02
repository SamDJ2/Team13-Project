import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHabitstracking } from '../habitstracking.model';
import { HabitstrackingService } from '../service/habitstracking.service';

@Injectable({ providedIn: 'root' })
export class HabitstrackingRoutingResolveService implements Resolve<IHabitstracking | null> {
  constructor(protected service: HabitstrackingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHabitstracking | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((habitstracking: HttpResponse<IHabitstracking>) => {
          if (habitstracking.body) {
            return of(habitstracking.body);
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
