import { compare, createToken } from './utils';

export default (find, data) => {
  const { email, password } = data;
  const invalidEmailPasswordError = () =>
    new Error('Invalid email/password combination.');

  const compareUserPassword = users => {
    const user = users[0];

    if (!user) return Promise.reject(invalidEmailPasswordError());
    if (!compare(password, user.password)) return Promise.reject(invalidEmailPasswordError());

    return user;
  };

  return find('test-token', 'user', { email })
    .then(compareUserPassword)
    .then(createToken);
};
