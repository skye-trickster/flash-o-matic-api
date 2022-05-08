function methodNotAllowed(request, response, next) {
    next({
        status: 405,
        message: `Requested method invalid: ${request.method}`
    })
}

module.exports = methodNotAllowed