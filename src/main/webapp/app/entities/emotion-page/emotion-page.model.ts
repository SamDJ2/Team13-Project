import dayjs from 'dayjs/esm';
import { IMoodPicker } from 'app/entities/mood-picker/mood-picker.model';
import { AIGeneratedPrompts } from 'app/entities/enumerations/ai-generated-prompts.model';
import { TabLabel } from 'app/entities/enumerations/tab-label.model';

export interface IEmotionPage {
  id: number;
  prompts?: AIGeneratedPrompts | null;
  date?: dayjs.Dayjs | null;
  promptedEntry?: string | null;
  currentTab?: TabLabel | null;
  moodPicker?: Pick<IMoodPicker, 'id'> | null;
}

export type NewEmotionPage = Omit<IEmotionPage, 'id'> & { id: null };
