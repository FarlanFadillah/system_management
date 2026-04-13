import generator from "meaningful-string";

let options = {
    min: 5,
    max: 5,
    allCaps: true,
    capsWithNumbers: true,
};

export function genStringCaps(min, max) {
    return generator.random({ min, max, ...options });
}
