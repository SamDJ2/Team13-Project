import { IWeeklySummary, NewWeeklySummary } from './weekly-summary.model';

export const sampleWithRequiredData: IWeeklySummary = {
  id: 13405,
};

export const sampleWithPartialData: IWeeklySummary = {
  id: 8360,
  summaryText: 'Awesome',
};

export const sampleWithFullData: IWeeklySummary = {
  id: 21896,
  summaryID: 82598,
  summaryText: 'Concrete Pants connecting',
};

export const sampleWithNewData: NewWeeklySummary = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
