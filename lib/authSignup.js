import { hash } from './utils';

export default (create, user) => {
  const { password } = user;

  return create('user', {
    // merge user fields
    ...user,

    // override password with the hashed one
    password: hash(password),
  });
};
