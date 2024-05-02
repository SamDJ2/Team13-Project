import { ISearch, NewSearch } from './search.model';

export const sampleWithRequiredData: ISearch = {
  id: 91139,
};

export const sampleWithPartialData: ISearch = {
  id: 76610,
  search: 'Islands Steel drive',
};

export const sampleWithFullData: ISearch = {
  id: 76966,
  search: 'Avon Cambridgeshire Coordinator',
  results: 'Home back-end repurpose',
};

export const sampleWithNewData: NewSearch = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
