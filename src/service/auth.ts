import { post } from "../util/request";

export function login(userName: string, password: string) {
    return post("/api", {
        userName,
        password
    });
}

export function logout() {
    return post("/api/logout");
}
