import dayjs from 'dayjs/esm';

import { IHistory, NewHistory } from './history.model';

export const sampleWithRequiredData: IHistory = {
  id: 42912,
};

export const sampleWithPartialData: IHistory = {
  id: 82137,
  challengeName: 'Estates enable Centralized',
};

export const sampleWithFullData: IHistory = {
  id: 50455,
  challengeName: 'Checking primary Licensed',
  challengeLevel: 'Shoes Frozen platforms',
  dateStarted: dayjs('2024-03-18T09:52'),
  username: 'Awesome',
};

export const sampleWithNewData: NewHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
