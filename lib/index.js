/* eslint-disable no-console */
import { keys } from 'lodash';
import authSignup from './authSignup';
import authToken from './authToken';
import verify from './verify';
import create from './create';
import archive from './archive';
import fetch from './fetch';
import find from './find';
import update from './update';
import { verifyToken } from './utils';
import { notAuthorizedError, authRouteError, authTableError } from './errors';

const checkAuthorize = (token) => {
  if (!verifyToken(token)) throw notAuthorizedError();
};

export default class Store {
  constructor(schemas = {}, fixtures = {}, table = 'user') {
    const database = {};
    const types = keys(schemas);

    if (!types.length) {
      console.warn(
        'You passed in a schemas object with no keys.'
      );
    }

    types.forEach(schema => (database[schema] = {}));

    this.schemas = schemas;
    this.database = { ...database, ...fixtures };
    this.table = table;
  }

  auth(route, table, data) {
    if (table !== this.table) throw authTableError();
    switch (route) {
      case 'token':
        return authToken(
          this.find.bind(this),
          data,
        );
      case 'signup':
        return authSignup(
          this.create.bind(this),
          this.find.bind(this),
          data,
        );
      default:
        throw authRouteError(route);
    }
  }

  verify(token) {
    return verify(
      this.fetch.bind(this),
      token
    );
  }

  create(authorization, type, record) {
    checkAuthorize(authorization);
    const { database, schemas } = this;
    return create({ database, schemas, type, record });
  }

  archive(authorization, type, id) {
    checkAuthorize(authorization);
    const { database, schemas } = this;
    return archive({ database, type, id, schemas });
  }

  fetch(authorization, type, id) {
    checkAuthorize(authorization);
    const { database, schemas } = this;
    return fetch({ database, schemas, type, id });
  }

  find(authorization, type, filters) {
    checkAuthorize(authorization);
    const { database, schemas } = this;
    return find({ database, schemas, type, filters });
  }

  update(authorization, type, id, data) {
    checkAuthorize(authorization);
    const { database, schemas } = this;
    return update({ database, schemas, type, id, data });
  }
}
