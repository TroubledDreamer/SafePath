export interface Driver {
  id: number;
  plate: string;
  car_type: string;
  user_id: number | null;
  date?: string | null;         // nullable DATETIME
  created_at: string;           // ISO datetime
}

export interface CreateDriverRequest {
  plate: string;
  car_type: string;
  // user_id is inferred from JWT (user-scoped)
}

export interface UpdateDriverRequest {
  plate?: string;
  car_type?: string;
  date?: string | null;
}