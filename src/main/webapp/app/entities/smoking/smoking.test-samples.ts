import { ISmoking, NewSmoking } from './smoking.model';

export const sampleWithRequiredData: ISmoking = {
  id: 65009,
};

export const sampleWithPartialData: ISmoking = {
  id: 95090,
};

export const sampleWithFullData: ISmoking = {
  id: 58780,
  levels: 'Sleek Illinois mobile',
  progress: 'Ball Bahrain Mobility',
  timer: '21263',
};

export const sampleWithNewData: NewSmoking = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
