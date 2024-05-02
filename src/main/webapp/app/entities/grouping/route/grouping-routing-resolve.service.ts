import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrouping } from '../grouping.model';
import { GroupingService } from '../service/grouping.service';

@Injectable({ providedIn: 'root' })
export class GroupingRoutingResolveService implements Resolve<IGrouping | null> {
  constructor(protected service: GroupingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrouping | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grouping: HttpResponse<IGrouping>) => {
          if (grouping.body) {
            return of(grouping.body);
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
