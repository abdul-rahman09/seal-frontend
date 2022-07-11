/**
 * user.js is used to manage the user information which stores in cookies
 */
import Cookies from 'universal-cookie';
import { COOKIE_USER_TOKEN_FIELD } from 'config';
import axios from 'axios';
import get from 'lodash/get';
import { COOKIE_USER_SESSION, COOKIE_USER_REMEMBER } from 'config';

export function setUserToken(payload: any) {
  const cookies = new Cookies();
  cookies.set(COOKIE_USER_TOKEN_FIELD, payload, { path: '/' });
}

export function getUserToken() {
  const cookies = new Cookies();
  return cookies.get(COOKIE_USER_TOKEN_FIELD);
}

export function deleteUserToken() {
  const cookies = new Cookies();
  cookies.remove(COOKIE_USER_TOKEN_FIELD);
}

export interface ISession {
  credentials: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface ILoginResponse {
  access: string;
  refresh: string;
}

export function getSession(): ISession {
  const cookies = new Cookies();
  return cookies.get(COOKIE_USER_SESSION);
}

export const setAxiosToken = (): void => {
  const session = getSession();
  axios.defaults.headers.common[
    'Authorization'
  ] = `Bearer ${session.credentials.accessToken}`;
};

export function getRefreshToken(): string | null {
  const session = getSession();
  if (session && session.credentials && session.credentials.refreshToken) {
    return session.credentials.refreshToken;
  }
  return null;
}

export function saveUserSession(user: ILoginResponse) {
  const cookies = new Cookies();
  const session = {
    credentials: {
      accessToken: user.access,
      refreshToken: user.refresh || getRefreshToken(),
    },
  };
  cookies.set(COOKIE_USER_SESSION, session, { path: '/' });
}

export const getAuthToken = () => {
  const session = getSession();
  if (session && session.credentials && session.credentials.accessToken) {
    return session.credentials.accessToken;
  }
  return null;
};

export function deleteSession(): void {
  const cookies = new Cookies();
  cookies.remove(COOKIE_USER_SESSION);
  axios.defaults.headers.common['Authorization'] = null;
}

export function deleteRememberMe(): void {
  const cookies = new Cookies();
  cookies.remove(COOKIE_USER_REMEMBER);
}

export function setLoginCookies(
  rememberMe: boolean,
  email: string,
  password: string
) {
  const cookies = new Cookies();
  const user = {
    email: rememberMe ? email : '',
    password: rememberMe ? password : '',
    rememberMe,
  };
  cookies.set(COOKIE_USER_REMEMBER, user);
}

export function getLoginCookies() {
  const cookies = new Cookies();
  const user = cookies.get(COOKIE_USER_REMEMBER);
  return {
    email: get(user, 'email', ''),
    password: get(user, 'password', ''),
    rememberMe: get(user, 'rememberMe', false),
  };
}
