import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IUserDB } from '../user-db.model';
import { UserDBService } from '../service/user-db.service';

@Injectable({ providedIn: 'root' })
export class UserDBRoutingResolveService implements Resolve<IUserDB | null> {
  constructor(protected service: UserDBService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserDB | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((userDB: HttpResponse<IUserDB>) => {
          if (userDB.body) {
            return of(userDB.body);
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
