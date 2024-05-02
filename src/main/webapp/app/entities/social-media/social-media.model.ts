export interface ISocialMedia {
  id: number;
  levels?: string | null;
  progress?: string | null;
  timer?: string | null;
}

export type NewSocialMedia = Omit<ISocialMedia, 'id'> & { id: null };
