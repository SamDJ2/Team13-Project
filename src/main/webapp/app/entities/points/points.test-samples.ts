import { IPoints, NewPoints } from './points.model';

export const sampleWithRequiredData: IPoints = {
  id: 33269,
};

export const sampleWithPartialData: IPoints = {
  id: 86798,
  totalPoints: 14659,
};

export const sampleWithFullData: IPoints = {
  id: 99795,
  username: 'EXE regional GB',
  currentPoints: 21107,
  previousPoints: 45763,
  totalPoints: 54285,
};

export const sampleWithNewData: NewPoints = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
