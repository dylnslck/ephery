/* eslint-disable no-console */
import fixtures from './fixtures';
import schemas from './schemas';
import Store from '../lib';

const db = new Store(schemas, fixtures);
const { create, find, update } = db;

// create a user
create('user', { name: 'John Doe', email: 'johndoe@gmail.com' });

// print out all the users
find('user').then(console.log);

// update John Doe then log the new user
const updateUser = user => update('user', user.id, { name: 'Johnny Doe' });
find('user', { name: 'John Doe' }).then(updateUser).then(console.log);
