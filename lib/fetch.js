import { invalidSchemaError, notFoundError } from './errors';
import { merge, delay } from './utils';

export default ({
  database,
  type,
  id,
  schemas,
}) => {
  if (!(type in database)) throw invalidSchemaError(type);
  if (!(id in database[type])) throw notFoundError(type, id);

  const record = { id, ...database[type][id] };

  return delay(100).then(() => ({
    ...record,
    ...merge(type, record, database, schemas),
  }));
};
