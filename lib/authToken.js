import { compare, createToken } from './utils';

export default (find, email, password) => {
  const invalidEmailPasswordError = () =>
    new Error('Invalid email/password combination.');

  const { reject } = Promise;

  const compareUserPassword = users => {
    const user = users[0];

    if (!user) return reject();
    if (!compare(password, user.password)) return reject();

    return user;
  };

  return find('user', { email })
    .then(compareUserPassword)
    .then(createToken)
    .catch(() => {
      throw invalidEmailPasswordError();
    });
};
