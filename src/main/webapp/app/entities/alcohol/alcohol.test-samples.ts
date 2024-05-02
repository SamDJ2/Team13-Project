import { IAlcohol, NewAlcohol } from './alcohol.model';

export const sampleWithRequiredData: IAlcohol = {
  id: 60786,
};

export const sampleWithPartialData: IAlcohol = {
  id: 33314,
  timer: '89918',
};

export const sampleWithFullData: IAlcohol = {
  id: 96096,
  levels: 'responsive',
  progress: 'Pula human-resource',
  timer: '72197',
};

export const sampleWithNewData: NewAlcohol = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
