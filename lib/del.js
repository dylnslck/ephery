/* eslint-disable no-param-reassign */
import { invalidSchemaError, notFoundError } from './errors';
import { delay } from './utils';

export default ({ database, type, id }) => {
  if (!(type in database)) throw invalidSchemaError(type);
  if (!(id in database[type])) throw notFoundError(type, id);

  return delay(100).then(() => {
    delete database[type][id];
    return true;
  });
};
