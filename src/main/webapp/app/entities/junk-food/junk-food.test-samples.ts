import { IJunkFood, NewJunkFood } from './junk-food.model';

export const sampleWithRequiredData: IJunkFood = {
  id: 76585,
};

export const sampleWithPartialData: IJunkFood = {
  id: 7349,
  progress: 'synthesizing Assistant',
  timer: '36463',
};

export const sampleWithFullData: IJunkFood = {
  id: 62728,
  levels: 'fault-tolerant',
  progress: 'withdrawal capability input',
  timer: '99319',
};

export const sampleWithNewData: NewJunkFood = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
