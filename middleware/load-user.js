const { promisify } = require('util');
const readFile = promisify(require('fs').readFile);
const path = require('path');

module.exports = async (req, res, next) => {
  const id = req.hostname.split('.')[0];
  res.locals.id = id;

  if (req.method.toUpperCase() !== 'GET') {
    return next();
  }

  // Otherwise load up the user json file
  res.locals.user = {
    copyright: '<copyright holders>',
  };

  try {
    const data = await readFile(
      path.join(__dirname, '..', 'users', `${id}.json`),
      'utf8'
    );
    res.locals.user = { ...res.locals.user, ...JSON.parse(data) };
  } catch ({ code, message }) {
    if (code !== 'ENOENT') {
      res
        .code(500)
        .send(
          `An internal error occurred - open an issue on https://github.com/remy/mit-license with the following information: ${message}`
        );
      return;
    }
  }

  next();
};
