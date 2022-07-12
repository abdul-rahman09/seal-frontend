import { AUTH_USER, SIGNOUT } from 'pages/Auth/ducks/action-types';
import {
  getAuthToken,
  saveUserSession,
  setAxiosToken,
  setUserToken,
} from 'utils/user';
import { authenticateUser, registerUser } from 'api';
import { fetchAllFiles } from 'pages/Dashboard/ducks/actions';
export function setAuthUser(payload: any) {
  return { type: AUTH_USER, payload };
}

export function deleteUserInfo() {
  return { type: SIGNOUT };
}

export const fetchInitialData = () => (dispatch: any, getState: any) => {
  dispatch(fetchAllFiles());
};

export const authenticateUserAction =
  (username: string, password: string) => (dispatch: any) => {
    return authenticateUser(username, password)
      .then(({ data }) => {
        if (data) {
          saveUserSession(data);
          dispatch(setAuthUser(data));
          setUserToken(data);
          return true;
        }
        return Promise.reject(data);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

export const registerUserAction =
  (username: string, password: string, firstName: string, lastName: string) =>
  (dispatch: any) => {
    return registerUser(username, password, firstName, lastName)
      .then((resp) => {
        if (resp) {
          dispatch(setAuthUser(resp));
          setUserToken(resp);
          return true;
        }
        return Promise.reject(resp);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

export const initUserSessionFromCookie =
  () => (dispatch: any, getState: any) => {
    const state = getState();
    if (!state.auth.isLoggedIn && getAuthToken()) {
      setAxiosToken();
      dispatch(fetchInitialData());
    }
  };
