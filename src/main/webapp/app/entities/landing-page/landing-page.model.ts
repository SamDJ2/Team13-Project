import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';

export interface ILandingPage {
  id: number;
  getStarted?: string | null;
  about?: string | null;
  team?: string | null;
  contact?: string | null;
  moodPicker?: Pick<IMoodPicker, 'id'> | null;
}

export type NewLandingPage = Omit<ILandingPage, 'id'> & { id: null };
