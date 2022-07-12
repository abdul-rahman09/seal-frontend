import { ALL_FILES } from 'pages/Dashboard/ducks/action-types';
import {
  fetchAllFilesApi,
  downloadMultipleFilesApi,
  uploadFileApi,
  getShareableLinkApi,
  downloadFileApi,
  fetchDetailsApi,
} from 'api';
import { saveAs } from 'file-saver';

export function filesUploaded(payload: any) {
  return { type: ALL_FILES, payload };
}

export const fetchAllFiles = () => (dispatch: any) => {
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

export const downloadMultipleFiles = (data: any) => (dispatch: any) => {
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

export const downloadFile = (data: any, name: string) => (dispatch: any) => {
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

export const fetchDetails = (data: any) => () => {
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
export const getShareableLink = (data: any) => () => {
  return getShareableLinkApi(data)
    .then((resp) => {
      return Promise.resolve(resp.data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
};
