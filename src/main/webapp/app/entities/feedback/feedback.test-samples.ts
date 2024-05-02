import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 38124,
  name: 'reboot',
  email: 'Meredith.Johnston@hotmail.com',
  subject: 'Steel Associate Chilean',
  message: 'e-tailers Liechtenstein COM',
};

export const sampleWithPartialData: IFeedback = {
  id: 40936,
  name: 'invoice virtual Corporate',
  email: 'Bernice_Schumm3@gmail.com',
  subject: 'initiatives discrete bypassing',
  message: 'e-commerce Fantastic bottom-line',
};

export const sampleWithFullData: IFeedback = {
  id: 39717,
  name: 'Gardens Nicaragua vortals',
  email: 'Lacy_Kreiger@hotmail.com',
  subject: 'program Cambridgeshire',
  message: 'Avon',
};

export const sampleWithNewData: NewFeedback = {
  name: 'mint AGP',
  email: 'Stephania_Tremblay50@yahoo.com',
  subject: 'exploit hack Producer',
  message: 'Practical Infrastructure',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
