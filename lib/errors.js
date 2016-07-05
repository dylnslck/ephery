export const invalidSchemaError = (type) =>
  new Error(`There is no schema with type '${type}'.`);

export const notFoundError = (type, id) =>
  new Error(`No record of type '${type}' with id '${id}' found.`);
