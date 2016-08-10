/* eslint-disable no-param-reassign */
import { cloneDeep } from 'lodash';
import { invalidSchemaError, notFoundError } from './errors';
import { merge, delay } from './utils';

export default ({ database, type, id, schemas }) => {
  if (!(type in database)) {
    return delay(100)
      .then(() => Promise.reject(invalidSchemaError(type)));
  }

  if (!(id in database[type])) {
    return delay(100)
      .then(() => Promise.reject(notFoundError(type, id)));
  }

  return delay(100).then(() => {
    const cloned = cloneDeep(database[type][id]);
    const merged = { id, ...merge(type, cloned, database, schemas) };

    delete database[type][id];
    return merged;
  });
};
