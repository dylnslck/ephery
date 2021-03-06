# Ephery
[![CircleCI](https://circleci.com/gh/dylnslck/ephery.svg?style=svg)](https://circleci.com/gh/dylnslck/ephery)
[![codecov](https://codecov.io/gh/dylnslck/ephery/branch/master/graph/badge.svg)](https://codecov.io/gh/dylnslck/ephery)
[![npm version](https://badge.fury.io/js/ephery.svg)](https://badge.fury.io/js/ephery)

Ephery is a dead simple, in-memory, client-side, fake API service that mirrors [redink-sdk](https://github.com/endfire/redink-sdk). This tool is useful for prototyping client-side applications without hijacking Ajax. In particular, this tool was built to interact with React + Redux applications that rely on an API service, but Ephery can be useful for any framework that isn't too opinionated on data-fetching.

## Getting started
```
npm install --save ephery
```

Define some basic schemas and fixtures.

```js
// src/services/store.js
import Store from 'ephery';

const schemas = {
  user: {
    attributes: {
      name: true,
      email: true,
    },
    relationships: {
      blogs: {
        hasMany: 'blog',
      },
      comments: {
        hasMany: 'comment',
      },
    },
  },
  blog: {
    attributes: {
      title: true,
      createdAt: true,
    },
    relationships: {
      author: {
        belongsTo: 'user',
      },
      comments: {
        hasMany: 'comment',
      },
    },
  },
  comment: {
    attributes: {
      text: true,
      createdAt: true,
    },
    relationships: {
      user: {
        belongsTo: 'user',
      },
      blog: {
        belongsTo: 'blog',
      },
    },
  },
};

const fixtures = {
  user: {
    1: {
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      blogs: ['1'],
      comments: ['1'],
    },
  },
  blog: {
    1: {
      title: 'Tabs vs. Spaces',
      author: '1',
      comments: ['1'],
    },
  },
  comment: {
    1: {
      text: 'First comment!',
      user: '1',
      blog: '1',
    },
  },
};

// Entity you want to use for authenticating
// Default is 'user'
const entity = 'user';

export default new Store(schemas, fixtures, entity);
```

Then somewhere in your application, you can invoke Ephery. All returned data is deeply nested JSON.
`authToken` is used to authorize api calls, Ephery expects `${user.id}-token` as a token.

```js
import api from '../services/store';
const authToken = localStorage.token;

api.fetch(authToken, 'user', '1').then(user => {
  /*
  {
    name: 'John Doe',
    email: 'johndoe@gmail.com',
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
    }]
  }
   */
});
```

## API

### .create(authToken, type, record) -> Object `async`

```js
api.create(authToken, 'user', {
  name: 'Dylan',
  email: 'dylan@gmail.com',
}).then(user => {
  // created user
});
```

### .fetch(authToken, type, id) -> Object `async`

```js
api.fetch(authToken, 'user', '1').then(user => {
  // single user
});
```

### .find(authToken, type, filters = {}) -> Object[] `async`

```js
api.find(authToken, 'user', {
  name: 'Dylan',
}).then(users => {
  // all users
});
```

### .update(authToken, type, id, data) -> Object `async`

```js
api.update(authToken, 'user', '1', {
  name: 'Bob',
}).then(user => {
  // updated user
});
```

### .archive(authToken, type, id) -> Object `async`

```js
api.archive(authToken, 'user', '1').then(user => {
  // deleted user
});
```

### .auth('signup', entity, data) -> Object `async`

This method simply creates a user and "hashes" the password. The password isn't actually hashed, but it simulates how it would happen on the server. Internally, the password is appended with "-secret", so that you can simulate users in fixtures by creating a user with the password field being "<something>-secret".

```js
api.auth('signup', 'user', {
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  password: 'password',
}).then(user => {
  // created user with the password "hashed"
});
```

### .auth('token', entity, data) -> Object `async`

This method exchanges an email/password combination for a token that can be stored (i.e. in localStorage).

```js
api.auth('token', 'user', {
  email: 'johndoe@gmail.com',
  password: 'password',
}).then(response => {
  /*
  {
    token: 'f96776b7-19d1-44d8-8f78-f4c708b53c8a-token',
    user: {
      id: 'f96776b7-19d1-44d8-8f78-f4c708b53c8a',
      name: 'John Doe',
      email: 'johndoe@gmail.com',
    },
  }
  */
}).catch(err => {
  // invalid email/password combination
});
```

### .verify(token) -> Object `async`

This method verifies that a token is valid. Internally, a token looks like "${id}-token", so that you can easily simulate tokens.

```js
api.verify(token).then(response => {
  /*
  {
    verified: boolean,
  }
  */
})
```

## React + Redux Example
[Dan Abramov](https://twitter.com/dan_abramov) has an excellent course on [Egghead.io](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) titled "Idiomatic Redux," where he mocks a [simple API service](https://github.com/gaearon/todos/blob/27-updating-data-on-the-server/src/api/index.js) that is invoked by actions. Ephery can act as that service in applications that have more intensive CRUD requirements. Because Ephery returns deeply-nested JSON objects, responses can be easily normalized and merged with the state tree.

You'll need to create your own production-grade API service once your backend is finished, but Ephery can act as a drop-in replacement until then.

## Current Gotchas
Relationships do not cascade right now. Meaning, if you delete a `user` entity that a blog's `author` relationship  (a `belongsTo` relationship) points to, the `blog` is not deleted. I'm going to add this functionality soon. Also, if you're using Normalizr, you'll essentially have to duplicate schema definitions.

Also, the coverage could be a lot better, so more tests are coming as well.
