import { IFiltered, NewFiltered } from './filtered.model';

export const sampleWithRequiredData: IFiltered = {
  id: 45962,
};

export const sampleWithPartialData: IFiltered = {
  id: 90299,
  search: 'Research Car',
  results: 'Fresh',
  filtering: false,
};

export const sampleWithFullData: IFiltered = {
  id: 66631,
  search: 'magnetic',
  results: 'auxiliary',
  filtering: false,
};

export const sampleWithNewData: NewFiltered = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
