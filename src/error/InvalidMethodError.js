const ErrorCode = require("./ErrorCodes");

function InvalidMethod(request, response, next) {
    next(new ErrorCode(405, `Cannot perform ${request.method} method on ${request.originalUrl}`))
}

module.exports = InvalidMethod