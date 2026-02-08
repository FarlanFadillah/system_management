export function globalErrorHandler(err, req, res, next){
    console.log(err.message);
    console.log(err.stack);
    res.status(400).json({success : true, msg : err.message});
}