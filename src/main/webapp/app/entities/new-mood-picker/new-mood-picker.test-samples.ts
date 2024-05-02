import { INewMoodPicker, NewNewMoodPicker } from './new-mood-picker.model';

export const sampleWithRequiredData: INewMoodPicker = {
  id: 98959,
};

export const sampleWithPartialData: INewMoodPicker = {
  id: 10549,
};

export const sampleWithFullData: INewMoodPicker = {
  id: 11832,
  username: 'killer',
  mood: 'Paradigm middleware Dollar',
};

export const sampleWithNewData: NewNewMoodPicker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
