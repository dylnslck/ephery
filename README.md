# Ephery
[![CircleCI](https://circleci.com/gh/dylnslck/ephery.svg?style=svg)](https://circleci.com/gh/dylnslck/ephery)
[![npm version](https://badge.fury.io/js/ephery.svg)](https://badge.fury.io/js/ephery)

Ephery is a dead simple, in-memory, client-side, fake API service. This tool is useful for prototyping client-side applications without hijacking Ajax. In particular, this tool was built to interact with React  + Redux applications that rely on an API service, but Ephery can be useful for any framework that isn't too opinionated on data-fetching.

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

export default new Store(schemas, fixtures);
```

Then somewhere in your application, you can invoke Ephery. All returned data is deeply nested JSON.

```js
import api from '../services/store';

api.fetch('user', '1').then(user => {
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

### .create(type, record) -> Object `async`

```js
api.create('user', {
  name: 'Dylan',
  email: 'dylan@gmail.com',
}).then(user => {

});
```

### .fetch(type, id) -> Object `async`

```js
api.fetch('user', '1').then(user => {

});
```

### .find(type, filters = {}) -> Object[] `async`

```js
api.find('user', {
  name: 'Dylan',
}).then(users => {

});
```

### .update(type, id, data) -> Object `async`

```js
api.update('user', '1', {
  name: 'Bob',
}).then(user => {

});
```

### .del(type, id) -> Boolean `async`

```js
api.del('user', '1').then(success => {
  // true or false
});
```

### .authToken(email, password) -> String `async`

```js
api.authToken('johndoe@gmail.com', 'password').then(token => {
  // token, useful for storing in localStorage, etc.
});
```

### .authSignup(user) -> Object `async`

```js
api.authSignup({
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  password: 'password',
}).then(user => {
  // created user with the password hashed
});
```

### .authVerify(token) -> Boolean `async`

```js
api.authVerify(token).then(success => {
  // true or false depending if the token is valid
});
```

## React + Redux Example
[Dan Abramov](https://twitter.com/dan_abramov) has an excellent course on [Egghead.io](https://egghead.io/courses/building-react-applications-with-idiomatic-redux) titled "Idiomatic Redux," where he mocks a [simple API service](https://github.com/gaearon/todos/blob/27-updating-data-on-the-server/src/api/index.js) that is invoked by actions. Ephery can act as that service in applications that have more intensive CRUD requirements. Because Ephery returns deeply-nested JSON objects, responses can be easily normalized and merged with the state tree.

You'll need to create your own production-grade API service once your backend is finished, but Ephery can act as a drop-in replacement until then.

## Current Gotchas
Relationships do not cascade right now. Meaning, if you delete a `user` entity that a blog's `author` relationship  (a `belongsTo` relationship) points to, the `blog` is not deleted. I'm going to add this functionality soon. Also, if you're using Normalizr, you'll essentially have to duplicate schema definitions.

Also, the coverage could be a lot better, so more tests are coming as well.
