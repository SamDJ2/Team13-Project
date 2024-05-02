import { INavigationPortal } from 'app/entities/navigation-portal/navigation-portal.model';
import { Moods } from 'app/entities/enumerations/moods.model';

export interface IMoodPicker {
  id: number;
  moodPickerID?: number | null;
  mood?: Moods | null;
  navigationPortal?: Pick<INavigationPortal, 'id'> | null;
}

export type NewMoodPicker = Omit<IMoodPicker, 'id'> & { id: null };
