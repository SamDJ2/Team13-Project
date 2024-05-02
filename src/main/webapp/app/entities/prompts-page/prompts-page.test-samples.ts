import dayjs from 'dayjs/esm';

import { TabLabel } from 'app/entities/enumerations/tab-label.model';

import { IPromptsPage, NewPromptsPage } from './prompts-page.model';

export const sampleWithRequiredData: IPromptsPage = {
  id: 20260,
};

export const sampleWithPartialData: IPromptsPage = {
  id: 87954,
  promptedEntries: 'drive Functionality',
  date: dayjs('2024-03-05'),
  currentTab: TabLabel['All'],
};

export const sampleWithFullData: IPromptsPage = {
  id: 327,
  promptedEntries: 'Berkshire',
  date: dayjs('2024-03-04'),
  emotionFromMoodPicker: 'extensible',
  currentTab: TabLabel['Prompts'],
};

export const sampleWithNewData: NewPromptsPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
