import dayjs from 'dayjs/esm';

import { ITimer, NewTimer } from './timer.model';

export const sampleWithRequiredData: ITimer = {
  id: 36348,
};

export const sampleWithPartialData: ITimer = {
  id: 29027,
  startTime: dayjs('2024-03-16'),
  isActive: false,
};

export const sampleWithFullData: ITimer = {
  id: 46235,
  startTime: dayjs('2024-03-16'),
  isActive: true,
};

export const sampleWithNewData: NewTimer = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
