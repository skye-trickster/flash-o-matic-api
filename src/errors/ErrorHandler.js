function errorHandler(error, request, response, next) {
    const { status = 500, message = "Internal server error" } = error;
    response.status(status).json({ error: message })
}

module.exports = errorHandler;