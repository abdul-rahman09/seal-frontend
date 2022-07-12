import React, { useEffect } from 'react';
import { AppRoutes } from 'routes';
import { deleteSession, deleteUserToken } from 'utils/user';

const Logout = () => {
  useEffect(() => {
    deleteUserToken();
    deleteSession();
    window.location.replace(AppRoutes.LOGIN.path);
  }, []);
  return <></>;
};

export default Logout;
