import { verifyToken } from './utils';

export default (fetch, token) => {
  const { reject } = Promise;
  const id = token.substring(0, token.indexOf('-token'));

  const invalidTokenError = () =>
    new Error('Token was unable to be verified.');

  const ensureValidToken = (user) => {
    if (!verifyToken(token)) return reject();

    return user;
  };

  const ensureValidUser = (user) => {
    if (!user) return reject();
    return user;
  };

  return fetch('user', id)
    .then(ensureValidToken)
    .then(ensureValidUser)
    .catch(() => {
      throw invalidTokenError();
    });
};
