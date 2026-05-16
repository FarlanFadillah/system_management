import createDebug from "debug";
const debug = createDebug("app:middleware:errors");

export function globalErrorHandler(err, req, res, next) {
    debug("[GLOBAL ERROR HANDLER]");
    // console.error("SQL : ", err.sqlMessage);
    console.error(err.message);
    console.error(err.stack);
    res.status(err.http_status || 400).json({
        success: false,
        msg: err.message,
        code: err.error_code,
    });
}

export function missingEndpoint(req, res, next) {
    res.status(404).json({
        success: false,
        msg: "Enpoint does not extists!",
    });
}
