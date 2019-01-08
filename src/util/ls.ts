export function getItem(key: string, isObject: boolean = false): any {
    try {
        const val = localStorage.getItem(key);
        if (val != null && isObject) {
            try {
                return JSON.parse(val);
            } catch (err) {
                //错误的话，返回原值
                return val;
            }
        }
        return val;
    } catch (err) {
        console.error("localStorage读取数据失败", err);
        return null;
    }
}

export function setItem(
    key: string,
    value: any,
    isObject: boolean = false
): void {
    try {
        if (typeof value === "object" && value !== null && isObject) {
            localStorage.setItem(key, JSON.stringify(value));
            return;
        }
        localStorage.setItem(key, value);
    } catch (err) {
        console.error("localStorage存储数据失败", err);
    }
}
