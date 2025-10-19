export interface AuthUser {
  id: number;
  email: string;
  name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface info {
  sex: "M" | "F" | "Other";
  height_cm: number;
  date_of_birth: Date;


}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  info: info;

}


export interface Response {
  token: string;
  user: AuthUser;
}


