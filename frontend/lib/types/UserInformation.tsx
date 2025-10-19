import { Gender } from "./Enums";

export interface UserInformation {
  id: number;
  user_id: number;
  date_of_birth: string;        // ISO date (YYYY-MM-DD)
  gender: Gender;
  height: string;               // e.g., "180cm"
  phone_number: string;
}