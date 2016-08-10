import { hash, createToken } from './utils';

export default (create, find, user) => {
  const { password, email } = user;

  const userAlreadyExistsError = () =>
    new Error('This email address is already taken.');

  const rejectIfExists = (users) => {
    if (users.length) return Promise.reject(userAlreadyExistsError());
    return true;
  };

  const createUser = () => create('test-token', 'user', {
    // merge user fields
    ...user,

    // override password with the hashed one
    password: hash(password),
  });

  return find('test-token', 'user', { email })
    .then(rejectIfExists)
    .then(createUser)
    .then(createToken);
};
