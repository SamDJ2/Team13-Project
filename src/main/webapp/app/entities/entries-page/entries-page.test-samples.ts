import dayjs from 'dayjs/esm';

import { TabLabel } from 'app/entities/enumerations/tab-label.model';

import { IEntriesPage, NewEntriesPage } from './entries-page.model';

export const sampleWithRequiredData: IEntriesPage = {
  id: 63816,
};

export const sampleWithPartialData: IEntriesPage = {
  id: 18506,
  normalEntries: 'e-services Computers',
  currentTab: TabLabel['Entries'],
};

export const sampleWithFullData: IEntriesPage = {
  id: 32825,
  normalEntries: 'paradigms',
  date: dayjs('2024-03-04'),
  currentTab: TabLabel['Entries'],
};

export const sampleWithNewData: NewEntriesPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
