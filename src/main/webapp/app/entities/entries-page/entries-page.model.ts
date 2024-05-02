import dayjs from 'dayjs/esm';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

export interface IEntriesPage {
  id: number;
  normalEntries?: string | null;
  date?: dayjs.Dayjs | null;
  currentTab?: TabLabel | null;
  moodJournalPage?: Pick<IMoodJournalPage, 'id'> | null;
}

export type NewEntriesPage = Omit<IEntriesPage, 'id'> & { id: null };
