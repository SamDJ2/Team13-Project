import dayjs from 'dayjs/esm';

import { IGrouping, NewGrouping } from './grouping.model';

export const sampleWithRequiredData: IGrouping = {
  id: 86814,
};

export const sampleWithPartialData: IGrouping = {
  id: 28278,
  iD: 'Account cultivate',
  remainingTime: '27688',
};

export const sampleWithFullData: IGrouping = {
  id: 6783,
  iD: 'generate optimizing Investor',
  groupingName: 'European green',
  groupingPoints: 91860,
  remainingTime: '24064',
  currentDate: dayjs('2024-03-04'),
};

export const sampleWithNewData: NewGrouping = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
