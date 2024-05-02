import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJunkFood, NewJunkFood } from '../junk-food.model';

export type PartialUpdateJunkFood = Partial<IJunkFood> & Pick<IJunkFood, 'id'>;

export type EntityResponseType = HttpResponse<IJunkFood>;
export type EntityArrayResponseType = HttpResponse<IJunkFood[]>;

@Injectable({ providedIn: 'root' })
export class JunkFoodService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/junk-foods');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(junkFood: NewJunkFood): Observable<EntityResponseType> {
    return this.http.post<IJunkFood>(this.resourceUrl, junkFood, { observe: 'response' });
  }

  update(junkFood: IJunkFood): Observable<EntityResponseType> {
    return this.http.put<IJunkFood>(`${this.resourceUrl}/${this.getJunkFoodIdentifier(junkFood)}`, junkFood, { observe: 'response' });
  }

  partialUpdate(junkFood: PartialUpdateJunkFood): Observable<EntityResponseType> {
    return this.http.patch<IJunkFood>(`${this.resourceUrl}/${this.getJunkFoodIdentifier(junkFood)}`, junkFood, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJunkFood>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJunkFood[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJunkFoodIdentifier(junkFood: Pick<IJunkFood, 'id'>): number {
    return junkFood.id;
  }

  compareJunkFood(o1: Pick<IJunkFood, 'id'> | null, o2: Pick<IJunkFood, 'id'> | null): boolean {
    return o1 && o2 ? this.getJunkFoodIdentifier(o1) === this.getJunkFoodIdentifier(o2) : o1 === o2;
  }

  addJunkFoodToCollectionIfMissing<Type extends Pick<IJunkFood, 'id'>>(
    junkFoodCollection: Type[],
    ...junkFoodsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const junkFoods: Type[] = junkFoodsToCheck.filter(isPresent);
    if (junkFoods.length > 0) {
      const junkFoodCollectionIdentifiers = junkFoodCollection.map(junkFoodItem => this.getJunkFoodIdentifier(junkFoodItem)!);
      const junkFoodsToAdd = junkFoods.filter(junkFoodItem => {
        const junkFoodIdentifier = this.getJunkFoodIdentifier(junkFoodItem);
        if (junkFoodCollectionIdentifiers.includes(junkFoodIdentifier)) {
          return false;
        }
        junkFoodCollectionIdentifiers.push(junkFoodIdentifier);
        return true;
      });
      return [...junkFoodsToAdd, ...junkFoodCollection];
    }
    return junkFoodCollection;
  }
}
