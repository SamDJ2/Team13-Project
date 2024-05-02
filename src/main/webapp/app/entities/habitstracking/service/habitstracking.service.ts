import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabitstracking, NewHabitstracking } from '../habitstracking.model';
import { IHabit } from '../../habit/habit.model';

export type PartialUpdateHabitstracking = Partial<IHabitstracking> & Pick<IHabitstracking, 'id'>;

export type EntityResponseType = HttpResponse<IHabitstracking>;
export type EntityArrayResponseType = HttpResponse<IHabitstracking[]>;

@Injectable({ providedIn: 'root' })
export class HabitstrackingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/habitstrackings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(habitstracking: NewHabitstracking): Observable<EntityResponseType> {
    return this.http.post<IHabitstracking>(this.resourceUrl, habitstracking, { observe: 'response' });
  }

  getAllHabitstrackings(): Observable<IHabitstracking[]> {
    return this.http.get<IHabitstracking[]>(this.resourceUrl);
  }

  update(habitstracking: IHabitstracking): Observable<EntityResponseType> {
    return this.http.put<IHabitstracking>(`${this.resourceUrl}/${this.getHabitstrackingIdentifier(habitstracking)}`, habitstracking, {
      observe: 'response',
    });
  }

  toggleCompletedHabit(habit: IHabitstracking): Observable<EntityResponseType> {
    const updatedHabit = { ...habit, completedHabit: habit.completedHabit };
    return this.update(updatedHabit);
  }

  partialUpdate(habitstracking: PartialUpdateHabitstracking): Observable<EntityResponseType> {
    return this.http.patch<IHabitstracking>(`${this.resourceUrl}/${this.getHabitstrackingIdentifier(habitstracking)}`, habitstracking, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHabitstracking>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHabitstracking[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHabitstrackingIdentifier(habitstracking: Pick<IHabitstracking, 'id'>): number {
    return habitstracking.id;
  }

  getHabitsByWeek(weekOfHabit: number): Observable<IHabitstracking[]> {
    return this.http.get<IHabitstracking[]>(`${this.resourceUrl}/week/${weekOfHabit}`);
  }

  compareHabitstracking(o1: Pick<IHabitstracking, 'id'> | null, o2: Pick<IHabitstracking, 'id'> | null): boolean {
    return o1 && o2 ? this.getHabitstrackingIdentifier(o1) === this.getHabitstrackingIdentifier(o2) : o1 === o2;
  }

  addHabitstrackingToCollectionIfMissing<Type extends Pick<IHabitstracking, 'id'>>(
    habitstrackingCollection: Type[],
    ...habitstrackingsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const habitstrackings: Type[] = habitstrackingsToCheck.filter(isPresent);
    if (habitstrackings.length > 0) {
      const habitstrackingCollectionIdentifiers = habitstrackingCollection.map(
        habitstrackingItem => this.getHabitstrackingIdentifier(habitstrackingItem)!
      );
      const habitstrackingsToAdd = habitstrackings.filter(habitstrackingItem => {
        const habitstrackingIdentifier = this.getHabitstrackingIdentifier(habitstrackingItem);
        if (habitstrackingCollectionIdentifiers.includes(habitstrackingIdentifier)) {
          return false;
        }
        habitstrackingCollectionIdentifiers.push(habitstrackingIdentifier);
        return true;
      });
      return [...habitstrackingsToAdd, ...habitstrackingCollection];
    }
    return habitstrackingCollection;
  }
}
