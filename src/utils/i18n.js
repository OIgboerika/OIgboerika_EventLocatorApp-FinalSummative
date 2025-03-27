const translate = (req, key, options = {}) => {
  return req.t(key, options);
};

const translateError = (req, key, options = {}) => {
  return req.t(`errors.${key}`, options);
};

const translateSuccess = (req, key, options = {}) => {
  return req.t(`common.${key}`, options);
};

module.exports = {
  translate,
  translateError,
  translateSuccess,
};
