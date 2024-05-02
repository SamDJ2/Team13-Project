export interface IFeedback {
  id: number;
  name?: string | null;
  email?: string | null;
  subject?: string | null;
  message?: string | null;
}

export type NewFeedback = Omit<IFeedback, 'id'> & { id: null };
