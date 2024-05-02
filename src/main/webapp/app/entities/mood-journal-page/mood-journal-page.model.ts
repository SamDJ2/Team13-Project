import dayjs from 'dayjs/esm';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

export interface IMoodJournalPage {
  id: number;
  allEntries?: string | null;
  date?: dayjs.Dayjs | null;
  currentTab?: TabLabel | null;
}

export type NewMoodJournalPage = Omit<IMoodJournalPage, 'id'> & { id: null };
