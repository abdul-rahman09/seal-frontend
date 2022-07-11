const { REACT_APP_IS_PRODUCTION, REACT_APP_API_URL } = process.env;

export const IS_PRODUCTION = REACT_APP_IS_PRODUCTION === 'true';
export const API_BASE_PATH = `${REACT_APP_API_URL}`;
export const APP_NAME = 'React Boilerplate';
export const COOKIE_USER_TOKEN_FIELD = 'authToken';
export const COOKIE_USER_SESSION = 'user_session';
export const COOKIE_USER_REMEMBER = 'user_remember';
