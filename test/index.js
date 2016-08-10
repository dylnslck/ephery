import test from 'ava';
import Store from '../lib';
import helpers from './helpers';

const { schemas, fixtures } = helpers;
const db = new Store(schemas, fixtures);

test('instantiating the store with schemas and fixtures should hydrate the database', t => {
  t.deepEqual(db.database, {
    ...fixtures,
    video: {},
  }, 'the instantiated database is properly hydrated');
});

test('creating an invalid type should throw an error', async t => {
  const type = 'invalid';

  try {
    await db.create('1-token', type);
  } catch (e) {
    t.truthy(e, 'the error is a valid object');
    t.is(e.message, `There is no schema with type '${type}'.`);
  }
});

test('fetching an invalid type should throw an error', async t => {
  const type = 'invalid';

  try {
    await db.fetch('1-token', type, '1');
  } catch (e) {
    t.truthy(e, 'the error is a valid object');
    t.is(e.message, `There is no schema with type '${type}'.`);
  }
});

test('finding an invalid type should throw an error', async t => {
  const type = 'invalid';

  try {
    await db.find('1-token', type, { name: 'John Doe' });
  } catch (e) {
    t.truthy(e, 'the error is a valid object');
    t.is(e.message, `There is no schema with type '${type}'.`);
  }
});

test('updating an invalid type should throw an error', async t => {
  const type = 'invalid';

  try {
    await db.update('1-token', type, '1', { name: 'Johnny Doe' });
  } catch (e) {
    t.truthy(e, 'the error is a valid object');
    t.is(e.message, `There is no schema with type '${type}'.`);
  }
});

test('deleting an invalid type should throw an error', async t => {
  const type = 'invalid';

  try {
    await db.archive('1-token', type, '1');
  } catch (e) {
    t.truthy(e, 'the error is a valid object');
    t.is(e.message, `There is no schema with type '${type}'.`);
  }
});

test('should create and fetch a user', async t => {
  const created = await db.create(
    '1-token',
    'user',
    { name: 'Dylan', email: 'dylanslack@gmail.com' }
  );
  const fetched = await db.fetch(`${created.id}-token`, 'user', created.id);

  const expected = {
    id: created.id,
    name: 'Dylan',
    email: 'dylanslack@gmail.com',
  };

  t.deepEqual(created, expected, 'created object has correct json');
  t.deepEqual(fetched, expected, 'fetched object has correct json');
});

test('should find users', async t => {
  const filtered = await db.find('1-token', 'user', { email: 'johndoe@gmail.com' });
  const notFound = await db.find('1-token', 'user', { email: 'invalid@email.com' });

  const expected = [{
    id: '1',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: '12345-secret',
    blogs: [{
      id: '1',
      title: 'Tabs vs. Spaces',
      author: '1',
      comments: ['1'],
    }],
    comments: [{
      id: '1',
      text: 'First comment!',
      user: '1',
      blog: '1',
    }],
  }];

  t.deepEqual(filtered, expected, 'filtered array has correct structure');
  t.deepEqual(notFound, [], 'filtered array has correct structure');
});

test('should update then delete first user', async t => {
  const found = await db.find('1-token', 'user');
  const updated = await db.update('1-token', 'user', found[0].id, { name: 'Dy-lon' });

  const expected = {
    ...found[0],
    name: 'Dy-lon',
  };

  const deleted = await db.archive(`${found[0].id}-token`, 'user', found[0].id);

  t.deepEqual(updated, expected, 'updated object has correct json');
  t.deepEqual(deleted, expected, 'object was correctly deleted');
  t.falsy(db.database[found[0].id], 'correctly spliced from database');
});

test('create, fetch, update, find with relationships', async t => {
  const user = await db.create(
    '1-token',
    'user',
    { name: 'Bob Jones', email: 'bobjones@gmail.com' }
  );
  const blog = await db.create('1-token', 'blog', { title: 'The Future of AI' });
  const comment = await db.create('1-token', 'comment', { text: 'Awesome!' });

  await db.update('1-token', 'user', user.id, {
    blogs: [blog.id],
    comments: [comment.id],
  });

  await db.update('1-token', 'blog', blog.id, {
    author: user.id,
    comments: [comment.id],
  });

  await db.update('1-token', 'comment', comment.id, {
    user: user.id,
    blog: blog.id,
  });

  const actual = await db.fetch('1-token', 'user', user.id);

  const expected = {
    id: user.id,
    name: 'Bob Jones',
    email: 'bobjones@gmail.com',
    blogs: [{
      id: blog.id,
      title: 'The Future of AI',
      author: user.id,
      comments: [comment.id],
    }],
    comments: [{
      id: comment.id,
      text: 'Awesome!',
      user: user.id,
      blog: blog.id,
    }],
  };

  t.deepEqual(expected, actual, 'fetched object has correct json');
});

test('authToken and authVerify with fixtures', async t => {
  const userAndToken = await db.auth(
    'token',
    'user',
    { email: 'johndoe@gmail.com', password: '12345' }
  );
  t.is(userAndToken.token, '1-token');

  const user = await db.verify(userAndToken.token);
  t.truthy(user.verified);

  try {
    await db.verify('invalid-token');
    t.fail();
  } catch (e) {
    t.truthy(e);
  }

  try {
    await db.verify('1-toke');
    t.fail();
  } catch (e) {
    t.truthy(e);
  }
});

test('authSignup with authToken', async t => {
  const email = 'auth@gmail.com';
  const password = 'secret';

  const user = await db.auth('signup', 'user', {
    name: 'Jimmy',
    email,
    password,
  });

  try {
    await db.auth('token', 'user', { email: 'wrong@gmail.com', password });
    t.fail();
  } catch (e) {
    t.is(e.message, 'Invalid email/password combination.');
  }

  try {
    await db.auth('token', 'user', { email, password: 'wrong' });
    t.fail();
  } catch (e) {
    t.is(e.message, 'Invalid email/password combination.');
  }

  const token = await db.auth('token', 'user', { email, password });
  t.deepEqual(token, { user: user.user, token: `${user.user.id}-token` });

  try {
    await db.auth('signup', 'user', {
      name: 'Jimmy',
      email,
      password,
    });

    t.fail();
  } catch (e) {
    t.is(e.message, 'This email address is already taken.');
  }
});
