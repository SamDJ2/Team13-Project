import { IHabitstracking, NewHabitstracking } from './habitstracking.model';

export const sampleWithRequiredData: IHabitstracking = {
  id: 97467,
};

export const sampleWithPartialData: IHabitstracking = {
  id: 72385,
  dayOfHabit: 'Auto',
  weekOfHabit: 90656,
  habitIDEN: 59209,
};

export const sampleWithFullData: IHabitstracking = {
  id: 10096,
  nameOfHabit: 'Tennessee Kuwaiti calculate',
  dayOfHabit: 'programming cross-media Isle',
  weekOfHabit: 38369,
  completedHabit: true,
  usernameHabit: 'override',
  habitIDEN: 99760,
  summary: 'Producer portals Oklahoma',
};

export const sampleWithNewData: NewHabitstracking = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
