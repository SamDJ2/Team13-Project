import { ILeaderBoards, NewLeaderBoards } from './leader-boards.model';

export const sampleWithRequiredData: ILeaderBoards = {
  id: 16690,
};

export const sampleWithPartialData: ILeaderBoards = {
  id: 637,
};

export const sampleWithFullData: ILeaderBoards = {
  id: 48048,
  standings: 'Tools',
};

export const sampleWithNewData: NewLeaderBoards = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
