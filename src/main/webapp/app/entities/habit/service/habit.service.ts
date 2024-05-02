import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHabit, NewHabit } from '../habit.model';

export type PartialUpdateHabit = Partial<IHabit> & Pick<IHabit, 'id'>;

export type EntityResponseType = HttpResponse<IHabit>;
export type EntityArrayResponseType = HttpResponse<IHabit[]>;

@Injectable({ providedIn: 'root' })
export class HabitService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/habits');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(habit: NewHabit): Observable<EntityResponseType> {
    return this.http.post<IHabit>(this.resourceUrl, habit, { observe: 'response' });
  }

  update(habit: IHabit): Observable<EntityResponseType> {
    return this.http.put<IHabit>(`${this.resourceUrl}/${this.getHabitIdentifier(habit)}`, habit, { observe: 'response' });
  }

  partialUpdate(habit: PartialUpdateHabit): Observable<EntityResponseType> {
    return this.http.patch<IHabit>(`${this.resourceUrl}/${this.getHabitIdentifier(habit)}`, habit, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IHabit>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHabit[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getHabitIdentifier(habit: Pick<IHabit, 'id'>): number {
    return habit.id;
  }

  compareHabit(o1: Pick<IHabit, 'id'> | null, o2: Pick<IHabit, 'id'> | null): boolean {
    return o1 && o2 ? this.getHabitIdentifier(o1) === this.getHabitIdentifier(o2) : o1 === o2;
  }

  addHabitToCollectionIfMissing<Type extends Pick<IHabit, 'id'>>(
    habitCollection: Type[],
    ...habitsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const habits: Type[] = habitsToCheck.filter(isPresent);
    if (habits.length > 0) {
      const habitCollectionIdentifiers = habitCollection.map(habitItem => this.getHabitIdentifier(habitItem)!);
      const habitsToAdd = habits.filter(habitItem => {
        const habitIdentifier = this.getHabitIdentifier(habitItem);
        if (habitCollectionIdentifiers.includes(habitIdentifier)) {
          return false;
        }
        habitCollectionIdentifiers.push(habitIdentifier);
        return true;
      });
      return [...habitsToAdd, ...habitCollection];
    }
    return habitCollection;
  }
}
