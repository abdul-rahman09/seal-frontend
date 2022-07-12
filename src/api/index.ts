import axios from 'axios';
import getRoute from 'api/routes';
import { AppRoutes } from 'routes';

export const setAuthToken = (token: string) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

const failedResponse = (error: any) => {
  if (
    error.response &&
    error.response.status &&
    error.response.status === 401
  ) {
    window.location.replace(AppRoutes.LOGOUT.path);
  }
  return Promise.reject(error);
};

const getRequest = (route: string) => {
  return axios
    .get(route)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return failedResponse(error);
    });
};

export const postRequest = (route: string, data = {}) => {
  return axios
    .post(route, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return failedResponse(error);
    });
};
export const blobPostRequest = (route: string, data = {}) => {
  return axios
    .post(route, data, { responseType: 'blob' })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return failedResponse(error);
    });
};
export const blobGetRequest = (route: string) => {
  return axios
    .get(route, { responseType: 'blob' })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return failedResponse(error);
    });
};
export const putRequest = (route: string, data = {}) => {
  return axios
    .put(route, data)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return failedResponse(error);
    });
};

export const registerUser = (
  username: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const data = { username, password, firstName, lastName };
  const route = getRoute('registerUser');
  return postRequest(route, data);
};

export const authenticateUser = (username: string, password: string) => {
  const data = { username, password };
  const route = getRoute('login');
  return postRequest(route, data);
};

export const getUserInfo = (userId: number) => {
  const route = getRoute('userProfile', { userId });
  return getRequest(route);
};

export const updateProfile = (
  userId: number,
  username: string,
  password: string,
  firstName: string,
  lastName: string
) => {
  const data = { username, password, firstName, lastName };
  const route = getRoute('userProfile', { userId });
  return putRequest(route, data);
};

export const fetchAllFilesApi = () => {
  const route = getRoute('files');
  return getRequest(route);
};

export const uploadFileApi = (formdata: FormData) => {
  const route = getRoute('files');
  return postRequest(route, formdata);
};

export const downloadMultipleFilesApi = (data: any) => {
  const route = getRoute('multiple');
  return blobPostRequest(route, { data });
};

export const downloadFileApi = (uuid: any) => {
  const route = getRoute('sharedDetail', { uuid });
  return blobGetRequest(route);
};

export const getShareableLinkApi = (data: any) => {
  const route = getRoute('shared');
  return postRequest(route, data);
};

export const fetchDetailsApi = (uuid: string) => {
  const route = getRoute('fetchDetail', { uuid });
  return getRequest(route);
};
