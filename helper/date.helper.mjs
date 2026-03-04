export function UTCToGMT(date, yearOnly = false) {
    let res;

    if (yearOnly) {
        res = new Date(date + " UTC").toLocaleDateString("id-ID", {
            timeZone: "Asia/Jakarta",
            weekday: "long", // full name of the day (e.g., "Senin")
            day: "numeric", // day of the month (e.g., "20")
            month: "long", // full name of the month (e.g., "Februari")
            year: "numeric", // full year (e.g., "2026")
        });
    } else {
        res = new Date(date + " UTC").toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
        });
    }
    return res;
}
