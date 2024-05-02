import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProgress } from '../progress.model';
import { ProgressService } from '../service/progress.service';

@Injectable({ providedIn: 'root' })
export class ProgressRoutingResolveService implements Resolve<IProgress | null> {
  constructor(protected service: ProgressService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProgress | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((progress: HttpResponse<IProgress>) => {
          if (progress.body) {
            return of(progress.body);
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
