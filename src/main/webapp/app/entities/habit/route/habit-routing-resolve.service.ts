import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHabit } from '../habit.model';
import { HabitService } from '../service/habit.service';

@Injectable({ providedIn: 'root' })
export class HabitRoutingResolveService implements Resolve<IHabit | null> {
  constructor(protected service: HabitService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHabit | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((habit: HttpResponse<IHabit>) => {
          if (habit.body) {
            return of(habit.body);
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
