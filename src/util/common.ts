export function getJSON(val: any): any {
    if (typeof val === "string" || val instanceof String) {
        return JSON.parse(val.toString());
    }
    return val;
}
