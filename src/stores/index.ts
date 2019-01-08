import { AuthStore, IAuthStoreValue, IAuthStore } from "./authStore";
import { getItem, setItem } from "../util/ls";
import { reaction } from "mobx";

const StoreClasses = {
    AuthStore
};

export interface IStores {
    authStore: IAuthStore;
}

interface IStoreValues {
    authStore: IAuthStoreValue;
}

const stores: IStores = {
    authStore: null!
};

function startSync(key: string) {
    // 需要节流？？
    Object.entries(stores).forEach(([storeKey, store]) => {
        reaction(
            () => store.toJSON(),
            (data, reaction) => {
                const jsonData = getItem(key, true) || {};
                setItem(key, { ...jsonData, [storeKey]: data }, true);
            }
        );
    });
}

function load(storeValues: IStoreValues): IStores {
    stores.authStore = new AuthStore(storeValues.authStore || {});
    return stores;
}

function loadFromLocalStore(key: string, callback?: Function): IStores {
    try {
        // localStorage读取值
        const storesValue = getItem(key, true) || {};

        const storesAny = stores as any;
        const StoreClassesAny = StoreClasses as any;

        Object.keys(stores).forEach((storeKey: string) => {
            const className = storeKey[0].toUpperCase() + storeKey.slice(1);
            const storeValue: any = storesValue[storeKey];
            if (typeof storeValue === "object" && storeValue !== null) {
                storesAny[storeKey] = new StoreClassesAny[className](
                    storeValue
                );
            } else {
                storesAny[storeKey] = new StoreClassesAny[className]({});
            }
        });

        callback && callback(stores);
        return stores;
    } catch (err) {
        console.error("初始化stores失败", err);
        return null!;
    }
}

function saveToLocalStore(key: string): void {
    const obj: any = {};
    for (let [key, value] of Object.entries(stores)) {
        obj[key] = value.toJSON();
    }
    setItem(key, obj, true);
}

export function getLoader(key: string) {
    return {
        load,
        loadFromLocalStore: () =>
            loadFromLocalStore(key, () => {
                startSync(key);
            }),
        saveToLocalStore: () => saveToLocalStore(key)
    };
}
