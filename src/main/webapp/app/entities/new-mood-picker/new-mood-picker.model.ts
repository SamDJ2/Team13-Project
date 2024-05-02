export interface INewMoodPicker {
  id: number;
  username?: string | null;
  mood?: string | null;
}

export type NewNewMoodPicker = Omit<INewMoodPicker, 'id'> & { id: null };
