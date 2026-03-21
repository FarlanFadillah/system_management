export class ExpressError extends Error {
    constructor(message, http_status = 400, error_code = "SOMETHING_BROKE") {
        super(message);
        this.http_status = http_status;
        this.error_code = error_code;
    }
}
