export const invalidSchemaError = (type) =>
  new Error(`There is no schema with type '${type}'.`);

export const notFoundError = (type, id) =>
  new Error(`No record of type '${type}' with id '${id}' found.`);

export const notAuthorizedError = () =>
  new Error('Not authorized.');

export const authRouteError = (route) =>
  new Error(`Authenticate route '${route}' is not allowed.`);

export const authTableError = () =>
  new Error('Authenticate table not defined.');
