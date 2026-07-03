const axios = require("axios");
const { backendUrl, backendEmail, backendPassword } = require("../config");

let cookieHeader = "";
let loginPromise = null;

function buildCookieHeader(setCookie) {
    return (setCookie || [])
        .map(cookie => cookie.split(";")[0])
        .filter(Boolean)
        .join("; ");
}

async function login() {
    if (cookieHeader) {
        return cookieHeader;
    }

    if (!loginPromise) {
        loginPromise = (async () => {
            const response = await axios.post(
                `${backendUrl}/auth/login`,
                {
                    email: backendEmail,
                    password: backendPassword
                },
                {
                    validateStatus: status => status < 500
                }
            );

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Unable to log in to the backend.");
            }

            const nextCookieHeader = buildCookieHeader(response.headers["set-cookie"]);

            if (!nextCookieHeader) {
                throw new Error("Backend login did not return session cookies.");
            }

            cookieHeader = nextCookieHeader;
            return cookieHeader;
        })().finally(() => {
            loginPromise = null;
        });
    }

    return loginPromise;
}

async function request(method, path, data, retry = true) {
    await login();

    const response = await axios.request({
        method,
        url: `${backendUrl}${path}`,
        data,
        headers: {
            Cookie: cookieHeader
        },
        validateStatus: status => status < 500
    });

    if (response.status === 401 && retry) {
        cookieHeader = "";
        return request(method, path, data, false);
    }

    if (response.status >= 400) {
        throw new Error(response.data?.message || `Backend request failed with status ${response.status}.`);
    }

    return response.data?.data;
}

function normalizeName(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function findRoomByQuery(rooms, query) {
    const normalizedQuery = normalizeName(query);

    if (!normalizedQuery) {
        return null;
    }

    return rooms.find(room => {
        const normalizedRoomName = normalizeName(room.name);
        return (
            normalizedRoomName === normalizedQuery ||
            normalizedRoomName.includes(normalizedQuery) ||
            normalizedQuery.includes(normalizedRoomName)
        );
    }) || null;
}

module.exports = {
    async getDashboard() {
        return request("get", "/dashboard");
    },

    async getPowerSnapshot() {
        return request("get", "/dashboard/power");
    },

    async getTodayUsage() {
        return request("get", "/usage/today");
    },

    findRoomByQuery
};