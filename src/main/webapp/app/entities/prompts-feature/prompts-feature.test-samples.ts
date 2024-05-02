import dayjs from 'dayjs/esm';

import { PromptsFeature, NewPromptsFeature } from './prompts-feature.model';

export const sampleWithRequiredData: PromptsFeature = {
  id: 74948,
};

export const sampleWithPartialData: PromptsFeature = {
  id: 83345,
  date: dayjs('2024-04-03'),
};

export const sampleWithFullData: PromptsFeature = {
  id: 74576,
  title: 'bypassing',
  prompt: 'blue next-generation Frozen',
  content: 'Turks',
  date: dayjs('2024-04-03'),
};

export const sampleWithNewData: NewPromptsFeature = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
