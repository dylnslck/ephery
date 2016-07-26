import { invalidSchemaError, notFoundError } from './errors';
import { merge, delay } from './utils';

export default ({
  database,
  type,
  id,
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

  const record = { id, ...database[type][id] };

  return delay(100).then(() => ({
    ...record,
    ...merge(type, record, database, schemas),
  }));
};
