/* eslint-disable no-param-reassign */
import { invalidSchemaError, notFoundError } from './errors';
import { delay } from './utils';

export default ({ database, type, id }) => {
  if (!(type in database)) {
    return delay(100)
      .then(() => Promise.reject(invalidSchemaError(type)));
  }

  if (!(id in database[type])) {
    return delay(100)
      .then(() => Promise.reject(notFoundError(type, id)));
  }

  return delay(100).then(() => {
    delete database[type][id];
    return true;
  });
};
