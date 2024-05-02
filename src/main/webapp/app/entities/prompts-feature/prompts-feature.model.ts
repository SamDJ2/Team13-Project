import dayjs from 'dayjs/esm';

export interface PromptsFeature {
  id: number;
  title?: string | null;
  prompt?: string | null;
  content?: string | null;
  date?: dayjs.Dayjs | null;
}

export type NewPromptsFeature = Omit<PromptsFeature, 'id'> & { id: null };
