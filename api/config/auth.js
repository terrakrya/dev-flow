const jwt = require('express-jwt')
const secret = process.env.SECRET || process.env.npm_package_name

function getTokenFromHeader(req) {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1]
  }

  return null
}

const jwtOptions = jwt({
  secret,
  algorithms: ['HS256'],
  userProperty: 'user',
  getToken: getTokenFromHeader,
})
module.exports = {
  authenticated: jwtOptions,
  optional: jwt({
    secret,
    userProperty: 'user',
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
}
