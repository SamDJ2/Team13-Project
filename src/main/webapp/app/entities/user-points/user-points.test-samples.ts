import { IUserPoints, NewUserPoints } from './user-points.model';

export const sampleWithRequiredData: IUserPoints = {
  id: 14929,
};

export const sampleWithPartialData: IUserPoints = {
  id: 13948,
  totalPoints: 77700,
};

export const sampleWithFullData: IUserPoints = {
  id: 63363,
  userID: 57457,
  currentPoints: 46333,
  previousPoints: 91043,
  totalPoints: 69920,
};

export const sampleWithNewData: NewUserPoints = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
