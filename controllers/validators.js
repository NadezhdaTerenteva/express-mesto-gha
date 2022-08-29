const hasLengthError = (value, min, max) => {

  return value.length < min || value.length > max;

}

module.exports = {
  hasLengthError
}