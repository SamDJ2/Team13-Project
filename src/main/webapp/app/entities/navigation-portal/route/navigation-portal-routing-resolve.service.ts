import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INavigationPortal } from '../navigation-portal.model';
import { NavigationPortalService } from '../service/navigation-portal.service';

@Injectable({ providedIn: 'root' })
export class NavigationPortalRoutingResolveService implements Resolve<INavigationPortal | null> {
  constructor(protected service: NavigationPortalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INavigationPortal | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((navigationPortal: HttpResponse<INavigationPortal>) => {
          if (navigationPortal.body) {
            return of(navigationPortal.body);
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
