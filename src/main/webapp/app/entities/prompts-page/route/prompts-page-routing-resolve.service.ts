import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPromptsPage } from '../prompts-page.model';
import { PromptsPageService } from '../service/prompts-page.service';

@Injectable({ providedIn: 'root' })
export class PromptsPageRoutingResolveService implements Resolve<IPromptsPage | null> {
  constructor(protected service: PromptsPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPromptsPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((promptsPage: HttpResponse<IPromptsPage>) => {
          if (promptsPage.body) {
            return of(promptsPage.body);
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
