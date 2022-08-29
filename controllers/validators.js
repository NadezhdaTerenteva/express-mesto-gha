const hasLengthError = (value, min, max) => {
  return value.length < min || value.length > max;
};

const idHasError = (value) => {
  return typeof value === "string" && value.length === 24 ? false : true;
};

module.exports = {
  hasLengthError,
  idHasError,
};
