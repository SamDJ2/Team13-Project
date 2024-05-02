import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMusic } from '../music.model';
import { MusicService } from '../service/music.service';

@Injectable({ providedIn: 'root' })
export class MusicRoutingResolveService implements Resolve<IMusic | null> {
  constructor(protected service: MusicService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMusic | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((music: HttpResponse<IMusic>) => {
          if (music.body) {
            return of(music.body);
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
