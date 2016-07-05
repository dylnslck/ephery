/* eslint-disable no-console */
import { keys } from 'lodash';
import authSignup from './authSignup';
import authToken from './authToken';
import authVerify from './authVerify';
import create from './create';
import del from './del';
import fetch from './fetch';
import find from './find';
import update from './update';

export default class Store {
  constructor(schemas = {}, fixtures = {}) {
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
  }

  authSignup(user) {
    const { database, schemas } = this;
    return authSignup({ database, schemas, user });
  }

  authToken(email, password) {
    return authToken(email, password);
  }

  authVerify(token) {
    return authVerify(token);
  }

  create(type, record) {
    const { database, schemas } = this;

    return create({ database, schemas, type, record });
  }

  del(type, id) {
    const { database } = this;
    return del({ database, type, id });
  }

  fetch(type, id) {
    const { database, schemas } = this;
    return fetch({ database, schemas, type, id });
  }

  find(type, filters) {
    const { database, schemas } = this;
    return find({ database, schemas, type, filters });
  }

  update(type, id, data) {
    const { database, schemas } = this;
    return update({ database, schemas, type, id, data });
  }
}
