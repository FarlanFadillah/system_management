export function UTCToGMT(date) {
    const res = new Date(date + " UTC").toLocaleString("id-ID", {
        timeZone: "Asia/Jakarta",
    });
    return res;
}
