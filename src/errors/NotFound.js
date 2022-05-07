function notFoundError(request, response, next) {
    return next({ status: 404, message: `Path not found: ${request.originalUrl}` })
}

module.exports = notFoundError