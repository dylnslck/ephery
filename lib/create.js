/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import { merge, delay } from './utils';
import { invalidSchemaError } from './errors';

export default ({
  database,
  type,
  record,
  schemas,
}) => {
  if (!(type in database)) {
    return delay(100)
      .then(() => Promise.reject(invalidSchemaError(type)));
  }

  return delay(100).then(() => {
    const id = v4();
    const merged = { ...record, ...merge(type, record, database, schemas) };
    database[type][id] = record;

    return { id, ...merged };
  });
};
