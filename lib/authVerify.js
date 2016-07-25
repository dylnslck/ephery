import { verifyToken } from './utils';

export default (fetch, token = '') => {
  const invalidTokenError = () =>
    new Error('Token was unable to be verified.');

  const id = token.substring(0, token.indexOf('-token'));

  const ensureValidToken = (user) => {
    if (!verifyToken(token)) return Promise.reject(invalidTokenError());
    return user;
  };

  const ensureValidUser = (user) => {
    if (!user) return Promise.reject(invalidTokenError());
    return user;
  };

  return fetch('user', id)
    .then(ensureValidToken)
    .then(ensureValidUser);
};
