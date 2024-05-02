import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfileCustomization } from '../profile-customization.model';
import { ProfileCustomizationService } from '../service/profile-customization.service';

@Injectable({ providedIn: 'root' })
export class ProfileCustomizationRoutingResolveService implements Resolve<IProfileCustomization | null> {
  constructor(protected service: ProfileCustomizationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfileCustomization | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((profileCustomization: HttpResponse<IProfileCustomization>) => {
          if (profileCustomization.body) {
            return of(profileCustomization.body);
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
