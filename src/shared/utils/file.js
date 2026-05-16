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
    if (!(await isExists(_path))) return;
    debug("deleting file", _path);
    await fs.unlink(_path);
}

export async function isExists(path) {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
}
