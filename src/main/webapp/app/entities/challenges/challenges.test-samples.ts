import { IChallenges, NewChallenges } from './challenges.model';

export const sampleWithRequiredData: IChallenges = {
  id: 94253,
};

export const sampleWithPartialData: IChallenges = {
  id: 55877,
  selectChallenge: false,
};

export const sampleWithFullData: IChallenges = {
  id: 28119,
  selectChallenge: false,
  allChallenges: 'Customer action-items',
};

export const sampleWithNewData: NewChallenges = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
