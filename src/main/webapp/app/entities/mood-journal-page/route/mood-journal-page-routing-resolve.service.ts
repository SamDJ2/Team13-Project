import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMoodJournalPage } from '../mood-journal-page.model';
import { MoodJournalPageService } from '../service/mood-journal-page.service';

@Injectable({ providedIn: 'root' })
export class MoodJournalPageRoutingResolveService implements Resolve<IMoodJournalPage | null> {
  constructor(protected service: MoodJournalPageService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoodJournalPage | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moodJournalPage: HttpResponse<IMoodJournalPage>) => {
          if (moodJournalPage.body) {
            return of(moodJournalPage.body);
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
