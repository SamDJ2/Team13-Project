import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMembers } from '../members.model';
import { MembersService } from '../service/members.service';

@Injectable({ providedIn: 'root' })
export class MembersRoutingResolveService implements Resolve<IMembers | null> {
  constructor(protected service: MembersService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMembers | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((members: HttpResponse<IMembers>) => {
          if (members.body) {
            return of(members.body);
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
