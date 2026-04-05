export function globalErrorHandler(err, req, res, next) {
    console.log("[GLOBAL ERROR HANDLER]");
    // console.error("SQL : ", err.sqlMessage);
    console.error(err.message);
    console.error(err.stack);
    res.status(err.http_status || 400).json({
        success: false,
        msg: err.message,
        code: err.error_code,
    });
}
