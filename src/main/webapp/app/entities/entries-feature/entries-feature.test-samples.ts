import dayjs from 'dayjs/esm';

import { EntriesFeature, NewEntriesFeature } from './entries-feature.model';

export const sampleWithRequiredData: EntriesFeature = {
  id: 59371,
};

export const sampleWithPartialData: EntriesFeature = {
  id: 58799,
  content: 'SSL revolutionize Programmable',
};

export const sampleWithFullData: EntriesFeature = {
  id: 40265,
  title: 'Avon',
  content: 'hack',
  date: dayjs('2024-03-29'),
};

export const sampleWithNewData: NewEntriesFeature = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
