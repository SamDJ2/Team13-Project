import { IMusic, NewMusic } from './music.model';

export const sampleWithRequiredData: IMusic = {
  id: 19201,
};

export const sampleWithPartialData: IMusic = {
  id: 68410,
};

export const sampleWithFullData: IMusic = {
  id: 24174,
  levels: 'compelling Soap',
  progress: 'innovate',
  timer: '65141',
};

export const sampleWithNewData: NewMusic = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
