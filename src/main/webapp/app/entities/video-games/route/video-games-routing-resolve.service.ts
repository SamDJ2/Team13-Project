import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVideoGames } from '../video-games.model';
import { VideoGamesService } from '../service/video-games.service';

@Injectable({ providedIn: 'root' })
export class VideoGamesRoutingResolveService implements Resolve<IVideoGames | null> {
  constructor(protected service: VideoGamesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVideoGames | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((videoGames: HttpResponse<IVideoGames>) => {
          if (videoGames.body) {
            return of(videoGames.body);
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
