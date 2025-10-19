import api from '../../lib/axios';
import {
  LoginPayload,
  SignupPayload,
  Response,
  AuthUser
} from '../types/api/Auth';

const endpoint = '/auth';

const login = async (payload: LoginPayload): Promise<Response> => {
  const res = await api.post(`${endpoint}/login`, payload);
  return res.data;
};

const signup = async (payload: SignupPayload): Promise<Response> => {
  const res = await api.post(`${endpoint}/register`, payload);
  return res.data;
};

const getProfile = async (): Promise<AuthUser> => {
  const res = await api.get(`${endpoint}/profile`);
  return res.data;
};

const logout = async (): Promise<{ message: string }> => {
  const res = await api.post(`${endpoint}/logout`);
  return res.data;
};

export default {
  login,
  signup,
  getProfile,
  logout
};
