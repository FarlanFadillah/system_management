export class ExpressError extends Error {
    constructor(message, http_status = 400) {
        super(message);
        this.http_status = http_status;
    }
}
