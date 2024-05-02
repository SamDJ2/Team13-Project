import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { PromptsFeature } from '../prompts-feature.model';
import { PromptsFeatureService } from '../service/prompts-feature.service';

@Injectable({ providedIn: 'root' })
export class PromptsFeatureRoutingResolveService implements Resolve<PromptsFeature | null> {
  constructor(protected service: PromptsFeatureService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<PromptsFeature | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((promptsFeature: HttpResponse<PromptsFeature>) => {
          if (promptsFeature.body) {
            return of(promptsFeature.body);
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
