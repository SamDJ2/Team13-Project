import dayjs from 'dayjs/esm';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { IEmotionPage } from 'app/entities/emotion-page/emotion-page.model';
import { IMoodJournalPage } from 'app/entities/mood-journal-page/mood-journal-page.model';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

export interface IPromptsPage {
  id: number;
  promptedEntries?: string | null;
  date?: dayjs.Dayjs | null;
  emotionFromMoodPicker?: string | null;
  currentTab?: TabLabel | null;
  moodPicker?: Pick<IMoodPicker, 'id'> | null;
  emotionPage?: Pick<IEmotionPage, 'id'> | null;
  moodJournalPage?: Pick<IMoodJournalPage, 'id'> | null;
}

export type NewPromptsPage = Omit<IPromptsPage, 'id'> & { id: null };
