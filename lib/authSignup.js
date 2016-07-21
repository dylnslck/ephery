import { hash } from './utils';

export default (create, find, user) => {
  const { password, email } = user;
  const { reject } = Promise;

  const userAlreadyExistsError = () =>
    new Error('This email address is already taken.');

  const rejectIfExists = (users) => {
    if (users.length) return reject();
    return true;
  };

  const createUser = () => create('user', {
    // merge user fields
    ...user,

    // override password with the hashed one
    password: hash(password),
  });

  return find('user', { email })
    .then(rejectIfExists)
    .then(createUser)
    .catch(() => {
      throw userAlreadyExistsError();
    });
};
