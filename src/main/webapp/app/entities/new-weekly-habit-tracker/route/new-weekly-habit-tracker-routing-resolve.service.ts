import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INewWeeklyHabitTracker } from '../new-weekly-habit-tracker.model';
import { NewWeeklyHabitTrackerService } from '../service/new-weekly-habit-tracker.service';

@Injectable({ providedIn: 'root' })
export class NewWeeklyHabitTrackerRoutingResolveService implements Resolve<INewWeeklyHabitTracker | null> {
  constructor(protected service: NewWeeklyHabitTrackerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INewWeeklyHabitTracker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((newWeeklyHabitTracker: HttpResponse<INewWeeklyHabitTracker>) => {
          if (newWeeklyHabitTracker.body) {
            return of(newWeeklyHabitTracker.body);
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
