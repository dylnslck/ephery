/* eslint-disable no-param-reassign */
import { invalidSchemaError, notFoundError } from './errors';
import { merge, delay } from './utils';

export default ({
  database,
  type,
  id,
  data,
  schemas,
}) => {
  if (!(type in database)) {
    return delay(100)
      .then(() => Promise.reject(invalidSchemaError(type)));
  }

  if (!(id in database[type])) {
    return delay(100)
      .then(() => Promise.reject(notFoundError(type, id)));
  }

  return delay(100).then(() => {
    const record = database[type][id];
    database[type][id] = { ...record, ...data };
    const merged = { ...record, ...data };

    return { id, ...merged, ...merge(type, merged, database, schemas) };
  });
};
