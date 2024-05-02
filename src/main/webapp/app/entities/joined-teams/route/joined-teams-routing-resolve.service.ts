import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IJoinedTeams } from '../joined-teams.model';
import { JoinedTeamsService } from '../service/joined-teams.service';

@Injectable({ providedIn: 'root' })
export class JoinedTeamsRoutingResolveService implements Resolve<IJoinedTeams | null> {
  constructor(protected service: JoinedTeamsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IJoinedTeams | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((joinedTeams: HttpResponse<IJoinedTeams>) => {
          if (joinedTeams.body) {
            return of(joinedTeams.body);
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
