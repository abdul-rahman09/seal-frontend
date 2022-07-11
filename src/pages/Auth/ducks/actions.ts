import { ALL_FILES, AUTH_USER, SIGNOUT } from 'pages/Auth/ducks/action-types';
import {
  getAuthToken,
  saveUserSession,
  setAxiosToken,
  setUserToken,
} from 'utils/user';
import {
  authenticateUser,
  registerUser,
  updateProfile,
  fetchAllFilesApi,
  downloadMultipleFilesApi,
  uploadFileApi,
  getShareableLinkApi,
  downloadFileApi,
  fetchDetailsApi,
} from 'api';
import { saveAs } from 'file-saver';

export function setAuthUser(payload: any) {
  return { type: AUTH_USER, payload };
}

export function deleteUserInfo() {
  return { type: SIGNOUT };
}
export function filesUploaded(payload: any) {
  return { type: ALL_FILES, payload };
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

export const updateProfileAction =
  (username: string, password: string, firstName: string, lastName: string) =>
  (dispatch: any, getState: any) => {
    const userId = getState().profile.userId;
    return updateProfile(userId, username, password, firstName, lastName)
      .then((resp) => {
        if (resp) {
          setUserToken(resp);
          return true;
        }
        return Promise.reject(resp);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

export const fetchAllFiles = () => (dispatch: any, getState: any) => {
  return fetchAllFilesApi()
    .then(({ files }) => {
      if (files) {
        dispatch(filesUploaded(files));
        return true;
      }
      return Promise.reject(files);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

export const downloadMultipleFiles =
  (data: any) => (dispatch: any, getState: any) => {
    return downloadMultipleFilesApi(data)
      .then((resp) => {
        if (resp.data) {
          saveAs(resp.data, 'files.zip');
          dispatch(fetchAllFiles());
          return true;
        }
        return Promise.reject(resp.data);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

export const downloadFile =
  (data: any, name: string) => (dispatch: any, getState: any) => {
    return downloadFileApi(data)
      .then((resp) => {
        if (resp.data) {
          saveAs(resp.data, name);
          dispatch(fetchAllFiles());
          return true;
        }
        return Promise.reject(resp.data);
      })
      .catch((e) => {
        return Promise.reject(e);
      });
  };

export const fetchDetails = (data: any) => (dispatch: any, getState: any) => {
  return fetchDetailsApi(data)
    .then((resp) => {
      if (resp) {
        return Promise.resolve(resp);
      }
      return Promise.reject(resp.data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};

export const uploadFile = (formdata: any) => (dispatch: any, getState: any) => {
  return uploadFileApi(formdata)
    .then((resp) => {
      dispatch(fetchAllFiles());
      return true;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};
export const getShareableLink =
  (data: any) => (dispatch: any, getState: any) => {
    return getShareableLinkApi(data)
      .then((resp) => {
        return Promise.resolve(resp.data);
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
