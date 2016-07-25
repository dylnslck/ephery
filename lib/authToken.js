import { compare, createToken } from './utils';

export default (find, email, password) => {
  let id;

  const invalidEmailPasswordError = () =>
    new Error('Invalid email/password combination.');

  const { reject } = Promise;

  const compareUserPassword = users => {
    const user = users[0];

    if (!user) return reject();
    if (!compare(password, user.password)) return reject();

    id = user.id;
    return user.id;
  };

  const createResponse = token => ({ id, token });

  return find('user', { email })
    .then(compareUserPassword)
    .then(createToken)
    .then(createResponse)
    .catch(() => {
      throw invalidEmailPasswordError();
    });
};
