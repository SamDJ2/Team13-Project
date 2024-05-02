import { IProgress, NewProgress } from './progress.model';

export const sampleWithRequiredData: IProgress = {
  id: 58317,
};

export const sampleWithPartialData: IProgress = {
  id: 81497,
  detoxProgress: 99958,
  leaderboardInfo: 'Ball Exclusive benchmark',
};

export const sampleWithFullData: IProgress = {
  id: 67940,
  detoxProgress: 95732,
  detoxTotal: 21061,
  challengesInfo: 'Account',
  leaderboardInfo: 'synergize',
};

export const sampleWithNewData: NewProgress = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
