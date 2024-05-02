export interface ISetting {
  id: number;
  notificationsEnabled?: boolean | null;
  accountDeletionRequested?: boolean | null;
  changePassword?: boolean | null;
}

export type NewSetting = Omit<ISetting, 'id'> & { id: null };
