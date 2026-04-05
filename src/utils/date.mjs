export function toISO(date) {
    if (!date) return null;
    // console.log("FROM:", date);
    const result = new Date(date + " UTC").toISOString();
    // console.log("TO:", result);
    return result;
}
