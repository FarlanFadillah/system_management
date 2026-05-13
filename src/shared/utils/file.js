import fs from "fs/promises";
import createDebug from "debug";
import path from "path";
const debug = createDebug("app:utils:file");

/**
 *
 * @param {String} dest
 */
export async function deleteFile(dest) {
    const _path = path.join("public", dest);
    if (!(await isExists(dest))) return;
    debug("deleting file", _path.substring(0, 10) + "...");
    await fs.unlink(_path);
}

export async function isExists(dest) {
    try {
        await fs.access(path.join(dest));
        return true;
    } catch (error) {
        return false;
    }
}
