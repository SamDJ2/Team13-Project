import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJunkFood } from '../junk-food.model';
import { JunkFoodService } from '../service/junk-food.service';

@Injectable({ providedIn: 'root' })
export class JunkFoodRoutingResolveService implements Resolve<IJunkFood | null> {
  constructor(protected service: JunkFoodService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJunkFood | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((junkFood: HttpResponse<IJunkFood>) => {
          if (junkFood.body) {
            return of(junkFood.body);
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
