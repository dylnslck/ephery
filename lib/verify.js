import { verifyToken } from './utils';

export default (fetch, token = '') => {
  const id = token.substring(0, token.indexOf('-token'));

  const ensureValidToken = () => {
    if (!verifyToken(token)) return { verified: false };
    return { verified: true };
  };

  return fetch('test-token', 'user', id)
    .then(ensureValidToken);
};
