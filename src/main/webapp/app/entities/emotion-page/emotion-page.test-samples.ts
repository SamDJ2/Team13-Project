import dayjs from 'dayjs/esm';

import { AIGeneratedPrompts } from 'app/entities/enumerations/ai-generated-prompts.model';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

import { IEmotionPage, NewEmotionPage } from './emotion-page.model';

export const sampleWithRequiredData: IEmotionPage = {
  id: 16681,
};

export const sampleWithPartialData: IEmotionPage = {
  id: 13633,
  date: dayjs('2024-03-05'),
};

export const sampleWithFullData: IEmotionPage = {
  id: 80294,
  prompts: AIGeneratedPrompts['Example1'],
  date: dayjs('2024-03-05'),
  promptedEntry: 'National redundant generation',
  currentTab: TabLabel['Entries'],
};

export const sampleWithNewData: NewEmotionPage = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
