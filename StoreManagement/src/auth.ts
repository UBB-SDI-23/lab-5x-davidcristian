import { User } from "./models/User";
import jwt_decode from "jwt-decode";

interface JwtPayload {
    exp: number;
}

let token: string | null = null;
let tokenExpirationDate: number | null = null;
let account: User | null = null;

export const logOut = () => {
    setAuthToken(null);
    setAccount(null);
};

export const setAuthToken = (newToken: string | null) => {
    token = newToken;
    if (!token) return;

    const decodedToken = jwt_decode<JwtPayload>(token);
    const expirationDate = decodedToken.exp * 1000;

    console.log("Token expiration date:", new Date(expirationDate));
    tokenExpirationDate = expirationDate;
};

export const getAuthToken = () => {
    if (token && tokenExpirationDate && tokenExpirationDate < Date.now()) {
        logOut();
    }

    return token;
};

export const setAccount = (newAccount: User | null) => {
    account = newAccount;
};

export const getAccount = () => {
    return account;
};

export const updatePref = (userId: number | undefined, pref: number) => {
    if (account && account.userProfile && account.id === userId) {
        account.userProfile.pagePreference = pref;
    }
};
