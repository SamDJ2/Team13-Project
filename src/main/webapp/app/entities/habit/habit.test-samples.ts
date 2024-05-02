import { IHabit, NewHabit } from './habit.model';

export const sampleWithRequiredData: IHabit = {
  id: 55429,
};

export const sampleWithPartialData: IHabit = {
  id: 69533,
  habitName: 'emulation Czech',
};

export const sampleWithFullData: IHabit = {
  id: 93589,
  habitID: 62955,
  habitName: 'turquoise',
};

export const sampleWithNewData: NewHabit = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
