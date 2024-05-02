import { Moods } from 'app/entities/enumerations/moods.model';

import { IMoodPicker, NewMoodPicker } from './mood-picker.model';

export const sampleWithRequiredData: IMoodPicker = {
  id: 35120,
};

export const sampleWithPartialData: IMoodPicker = {
  id: 38340,
  moodPickerID: 8334,
};

export const sampleWithFullData: IMoodPicker = {
  id: 53627,
  moodPickerID: 8147,
  mood: Moods['Mood3'],
};

export const sampleWithNewData: NewMoodPicker = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
