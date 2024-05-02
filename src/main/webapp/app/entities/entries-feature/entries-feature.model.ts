import dayjs from 'dayjs/esm';

export interface EntriesFeature {
  id: number;
  title?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewEntriesFeature = Omit<EntriesFeature, 'id'> & { id: null };
