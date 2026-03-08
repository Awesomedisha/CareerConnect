import { StatusCodes } from 'http-status-codes';

class CustomAPIError extends Error {
    constructor(message) {
        super(message);
    }
}

class BadRequestError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
}

class NotFoundError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

class UnAuthenticatedError extends CustomAPIError {
    constructor(message) {
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

export {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnAuthenticatedError,
};
