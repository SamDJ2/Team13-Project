import dayjs from 'dayjs/esm';

import { AchievementType } from 'app/entities/enumerations/achievement-type.model';

import { IAchievement, NewAchievement } from './achievement.model';

export const sampleWithRequiredData: IAchievement = {
  id: 23316,
};

export const sampleWithPartialData: IAchievement = {
  id: 53282,
  name: 'Delaware',
};

export const sampleWithFullData: IAchievement = {
  id: 54722,
  achievementID: 14354,
  name: 'copying connect',
  description: 'COM out-of-the-box',
  dateEarned: dayjs('2024-03-05'),
  achievementType: AchievementType['All_Time_Best'],
};

export const sampleWithNewData: NewAchievement = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
