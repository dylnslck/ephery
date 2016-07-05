import { hash } from './utils';
import create from './create';

export default ({ database, user, schemas }) => {
  const { password } = user;

  const createUser = hashedPassword => create({
    database,
    schemas,
    record: {
      // merge user fields
      ...user,

      // override password with the hashed one
      password: hashedPassword,
    },
  });

  return hash(password).then(createUser);
};
