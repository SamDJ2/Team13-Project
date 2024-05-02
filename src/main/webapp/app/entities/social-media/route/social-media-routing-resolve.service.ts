import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISocialMedia } from '../social-media.model';
import { SocialMediaService } from '../service/social-media.service';

@Injectable({ providedIn: 'root' })
export class SocialMediaRoutingResolveService implements Resolve<ISocialMedia | null> {
  constructor(protected service: SocialMediaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISocialMedia | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((socialMedia: HttpResponse<ISocialMedia>) => {
          if (socialMedia.body) {
            return of(socialMedia.body);
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
