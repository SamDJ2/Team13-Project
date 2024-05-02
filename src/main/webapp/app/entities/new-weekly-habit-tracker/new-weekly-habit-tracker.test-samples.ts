import dayjs from 'dayjs/esm';

import { INewWeeklyHabitTracker, NewNewWeeklyHabitTracker } from './new-weekly-habit-tracker.model';

export const sampleWithRequiredData: INewWeeklyHabitTracker = {
  id: 49200,
};

export const sampleWithPartialData: INewWeeklyHabitTracker = {
  id: 18677,
  recordID: 39961,
  habitCompletion: false,
  date: dayjs('2024-03-05'),
};

export const sampleWithFullData: INewWeeklyHabitTracker = {
  id: 50919,
  recordID: 59859,
  habitCompletion: true,
  date: dayjs('2024-03-04'),
};

export const sampleWithNewData: NewNewWeeklyHabitTracker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
