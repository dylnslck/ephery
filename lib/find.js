import { filter, keys } from 'lodash';
import { invalidSchemaError } from './errors';
import { merge, delay } from './utils';

export default ({
  database,
  type,
  schemas,
  filters = {},
}) => {
  if (!(type in database)) throw invalidSchemaError(type);

  return delay(100).then(() => {
    const records = keys(database[type]).map(id => ({ id, ...database[type][id] }));
    const filtered = filter(records, filters);

    const done = filtered.map(record => ({
      id: record.id,
      ...record,
      ...merge(type, record, database, schemas),
    }));

    return done;
  });
};
