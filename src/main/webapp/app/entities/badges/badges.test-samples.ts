import { IBadges, NewBadges } from './badges.model';

export const sampleWithRequiredData: IBadges = {
  id: 6345,
};

export const sampleWithPartialData: IBadges = {
  id: 6470,
  badgeNo: 93427,
  requiredPoints: 23278,
  badge: '../fake-data/blob/hipster.png',
  badgeContentType: 'unknown',
};

export const sampleWithFullData: IBadges = {
  id: 96823,
  badgeNo: 87457,
  requiredPoints: 15869,
  badge: '../fake-data/blob/hipster.png',
  badgeContentType: 'unknown',
};

export const sampleWithNewData: NewBadges = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
