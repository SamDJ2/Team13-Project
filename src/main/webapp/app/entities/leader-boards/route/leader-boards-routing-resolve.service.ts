import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeaderBoards } from '../leader-boards.model';
import { LeaderBoardsService } from '../service/leader-boards.service';

@Injectable({ providedIn: 'root' })
export class LeaderBoardsRoutingResolveService implements Resolve<ILeaderBoards | null> {
  constructor(protected service: LeaderBoardsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeaderBoards | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((leaderBoards: HttpResponse<ILeaderBoards>) => {
          if (leaderBoards.body) {
            return of(leaderBoards.body);
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
