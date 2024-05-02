import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAlcohol } from '../alcohol.model';
import { AlcoholService } from '../service/alcohol.service';

@Injectable({ providedIn: 'root' })
export class AlcoholRoutingResolveService implements Resolve<IAlcohol | null> {
  constructor(protected service: AlcoholService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAlcohol | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((alcohol: HttpResponse<IAlcohol>) => {
          if (alcohol.body) {
            return of(alcohol.body);
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
