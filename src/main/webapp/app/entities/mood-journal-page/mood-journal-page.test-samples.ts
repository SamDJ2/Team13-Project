import dayjs from 'dayjs/esm';

import { TabLabel } from 'app/entities/enumerations/tab-label.model';

import { IMoodJournalPage, NewMoodJournalPage } from './mood-journal-page.model';

export const sampleWithRequiredData: IMoodJournalPage = {
  id: 72141,
};

export const sampleWithPartialData: IMoodJournalPage = {
  id: 85291,
  allEntries: 'Engineer TCP',
  currentTab: TabLabel['All'],
};

export const sampleWithFullData: IMoodJournalPage = {
  id: 38626,
  allEntries: 'morph Generic',
  date: dayjs('2024-03-04'),
  currentTab: TabLabel['All'],
};

export const sampleWithNewData: NewMoodJournalPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
