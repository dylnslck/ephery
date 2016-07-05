import { compare, createToken } from './utils';
import find from './find';

export default (email, password) => {
  const compareUserPassword = user => compare(password, user.password);

  return find('user', { email }).then(compareUserPassword).then(createToken);
};
