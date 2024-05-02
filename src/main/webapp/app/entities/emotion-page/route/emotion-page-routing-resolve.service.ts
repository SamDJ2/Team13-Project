import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmotionPage } from '../emotion-page.model';
import { EmotionPageService } from '../service/emotion-page.service';

@Injectable({ providedIn: 'root' })
export class EmotionPageRoutingResolveService implements Resolve<IEmotionPage | null> {
  constructor(protected service: EmotionPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmotionPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((emotionPage: HttpResponse<IEmotionPage>) => {
          if (emotionPage.body) {
            return of(emotionPage.body);
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
