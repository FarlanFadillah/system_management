export function pagination(req, res, next) {
    let { currentpage, limit } = req.matchedData;
    if (!currentpage) currentpage = 1;

    if (!limit) limit = 10;
    else if (limit > 20) limit = 20;

    req.matchedData.currentpage = currentpage;
    req.matchedData.limit = limit;

    next();
}
