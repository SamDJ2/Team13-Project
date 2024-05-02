import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMoodPicker } from '../mood-picker.model';
import { MoodPickerService } from '../service/mood-picker.service';

@Injectable({ providedIn: 'root' })
export class MoodPickerRoutingResolveService implements Resolve<IMoodPicker | null> {
  constructor(protected service: MoodPickerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMoodPicker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((moodPicker: HttpResponse<IMoodPicker>) => {
          if (moodPicker.body) {
            return of(moodPicker.body);
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
