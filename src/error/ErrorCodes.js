class ErrorCode {
    constructor(status, message) { this.status = status, this.message = message }

    serialize() { return { status: this.status, message: this.message } }
}

module.exports = ErrorCode