export interface UserContact {
  id: number;
  user_id: number;              // owner of the contact list
  contact_user_id: number;      // the other user
  label?: string | null;
  is_emergency: boolean;
  created_at: string;           // ISO datetime
}

export interface CreateUserContactRequest {
  contact_user_id: number;
  label?: string;
  is_emergency?: boolean;
}

export interface UpdateUserContactRequest {
  label?: string | null;
  is_emergency?: boolean;
}