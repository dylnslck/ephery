export default (user) => ({
  user,
  token: `${user.id}-token`,
});
