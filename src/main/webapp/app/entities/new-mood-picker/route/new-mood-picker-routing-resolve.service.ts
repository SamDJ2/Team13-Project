import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INewMoodPicker } from '../new-mood-picker.model';
import { NewMoodPickerService } from '../service/new-mood-picker.service';

@Injectable({ providedIn: 'root' })
export class NewMoodPickerRoutingResolveService implements Resolve<INewMoodPicker | null> {
  constructor(protected service: NewMoodPickerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INewMoodPicker | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((newMoodPicker: HttpResponse<INewMoodPicker>) => {
          if (newMoodPicker.body) {
            return of(newMoodPicker.body);
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
