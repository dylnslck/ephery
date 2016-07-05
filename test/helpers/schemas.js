export default {
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
  video: {
    attributes: {
      title: true,
      url: true,
    },
    relationships: {
      user: {
        belongsTo: 'user',
      },
      comments: {
        hasMany: 'comment',
      },
    },
  },
};
