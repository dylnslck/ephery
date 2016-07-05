export default (plaintextPassword, hashedPassword) =>
  `${plaintextPassword}-secret` === hashedPassword;
